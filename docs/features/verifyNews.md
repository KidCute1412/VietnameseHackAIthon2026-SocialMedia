# Hướng dẫn Triển khai Tính năng Xác thực Tin tức (VerifyNews) - HypeRoom

Tài liệu này hướng dẫn chi tiết các bước thiết lập Backend, thu thập dữ liệu và tích hợp hệ thống RAG kiểm chứng tin tức để chống bịa đặt (hallucination) và tối ưu hóa tài nguyên cho MVP.

---

## 1. Danh sách Thư viện Cần cài đặt
Cài đặt các thư viện lõi cho việc cào dữ liệu, xử lý vector database và nhúng (embedding):
```bash
pip install feedparser newspaper3k chromadb sentence-transformers google-generativeai
```

---

## 2. Quy trình Vận hành Hệ thống (Step-by-Step)

### Bước 1: Thu thập Nguồn RSS đầu vào
*   **Nhiệm vụ**: Gom khoảng 15 - 30 link RSS chuyên mục chất lượng (Thời sự, Pháp luật, Chính sách) từ các báo lớn (`VnExpress`, `Tuổi Trẻ`, `Thanh Niên`) và cổng Chính phủ.
*   **Lưu trữ**: Lưu danh sách này trong một file cấu hình `rss_sources.json`.

### Bước 2: Xây dựng Cronjob thu thập và lọc trùng (De-duplication)
*   **Tần suất**: Chạy định kỳ (ví dụ: mỗi 30 - 60 phút).
*   **Logic xử lý**:
    1.  Dùng `feedparser` đọc danh sách RSS $\rightarrow$ Lấy tiêu đề, ngày xuất bản (`published`), và đường dẫn bài báo (`link`).
    2.  Kiểm tra đường dẫn `link` trong Database (SQLite/ChromaDB).
    3.  Nếu **chưa tồn tại**: Gọi `newspaper3k` tải nội dung chi tiết bài viết (`article.text`).
    4.  Nếu **đã tồn tại**: Bỏ qua để tiết kiệm tài nguyên.

### Bước 3: Nhúng Vector và Lưu trữ vào Vector Database
*   **Mô hình nhúng**: Sử dụng model **BGE-M3** (BAAI/bge-m3) để tạo vector (embedding) 1024 chiều từ nội dung bài báo chi tiết.
*   **Lưu trữ**: Đẩy đoạn văn bản, vector nhúng kèm các siêu dữ liệu (Metadata: `title`, `url`, `source`, `published_date`) vào **ChromaDB** (lưu trữ cục bộ dưới dạng file folder trong project).

### Bước 4: Tìm kiếm Chứng cứ đối chiếu (Semantic Search)
*   Khi người dùng nhập vào một Claim (tin đồn) hoặc tài liệu từ SmartReader:
    1.  Chuyển Claim đó thành Vector truy vấn bằng model **BGE-M3**.
    2.  Truy vấn ChromaDB để tìm **Top K (3-5)** đoạn văn bản có độ tương đồng cosine (Cosine Similarity) cao nhất.
    3.  Lọc và ưu tiên các tài liệu có `published_date` mới nhất (để xử lý các tin tức cập nhật/điều chỉnh).

### Bước 5: Kiểm chứng bằng Gemini API (RAG Ràng buộc Chặt chẽ)
*   **Prompt design**: Gửi Claim kèm các tài liệu đối chứng thu được từ Bước 4 vào Gemini 2.5 Flash.
*   **Ràng buộc (Grounding)**: Yêu cầu Gemini chỉ trả lời dựa trên ngữ cảnh được cung cấp, cấm bịa đặt, và bắt buộc phải trích dẫn rõ nguồn cụ thể (`[Nguồn 1]`, `[Nguồn 2]`).
*   **Đầu ra**: Yêu cầu trả về định dạng **JSON** chuẩn để Frontend dễ dàng bóc tách và hiển thị liên kết URL trực tiếp cho người dùng.

---

## 3. Bản phác thảo mã nguồn Lõi (Core Python Code)

```python
import feedparser
import chromadb
from newspaper import Article
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

# 1. Khởi tạo Model & DB
embedding_model = SentenceTransformer('BAAI/bge-m3')
chroma_client = chromadb.PersistentClient(path="./vector_db")
collection = chroma_client.get_or_create_collection(name="news_evidence")

# 2. Xử lý lưu vết & kiểm tra trùng
def ingest_article(url, title, source, published_date):
    # Lọc trùng bằng URL trong Vector DB
    existing = collection.get(ids=[url])
    if existing and existing['ids']:
        return False # Đã tồn tại
        
    try:
        # Cào full-text
        article = Article(url, language='vi')
        article.download()
        article.parse()
        
        # Nhúng Vector
        text_to_embed = f"Tiêu đề: {title}. Nội dung: {article.text}"
        vector = embedding_model.encode(text_to_embed).tolist()
        
        # Lưu trữ
        collection.add(
            ids=[url],
            embeddings=[vector],
            documents=[article.text],
            metadatas=[{
                "title": title, 
                "url": url, 
                "source": source, 
                "published_date": published_date
            }]
        )
        return True
    except Exception as e:
        print(f"Lỗi nạp bài viết: {e}")
        return False

# 3. Thực hiện RAG để Verify Claim
def verify_claim(user_claim):
    # Semantic Search tìm chứng cứ
    query_vector = embedding_model.encode(user_claim).tolist()
    results = collection.query(query_embeddings=[query_vector], n_results=3)
    
    # Chuẩn bị Context
    context_str = ""
    for i in range(len(results['documents'][0])):
        meta = results['metadatas'][0][i]
        context_str += f"[Nguồn {i+1}]: {meta['source']} - {meta['title']} ({meta['published_date']})\n"
        context_str += f"Đường dẫn: {meta['url']}\n"
        context_str += f"Nội dung: {results['documents'][0][i]}\n\n"
        
    # Gọi Gemini xác minh
    genai.configure(api_key="YOUR_GEMINI_API_KEY")
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    Xác minh tuyên bố sau chỉ dựa vào Chứng cứ được cung cấp. Cấm tự bịa đặt.
    Tuyên bố: "{user_claim}"
    Chứng cứ:
    {context_str}
    
    Trả về định dạng JSON:
    {{
      "verdict": "SUPPORTED" / "CONTRADICTED" / "UNCERTAIN",
      "explanation": "Lời giải thích kèm trích dẫn ví dụ [Nguồn 1]...",
      "sources": ["URL_1"]
    }}
    """
    response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
    return response.text
```
