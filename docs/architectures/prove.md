# HypeRoom - Technical Feasibility & Proof of Concept (PoC)

Tài liệu này chứa các đoạn mã Python mẫu được thiết kế theo cấu trúc phân đoạn (tương tự Jupyter Notebook) nhằm chứng minh tính khả thi của các thành phần cốt lõi trong hệ thống **HypeRoom**, đặc biệt là các giải pháp kết hợp giữa thuật toán định lượng, mô hình mã nguồn mở và Generative AI để tối ưu hóa độ tin cậy.

---

## Phân đoạn 1: Khởi tạo môi trường & Cấu hình Mock Data

Đoạn mã này định nghĩa cấu trúc dữ liệu cơ bản và giả lập dữ liệu đầu vào (Claims, Evidences) phục vụ cho toàn bộ Pipeline chạy thử nghiệm phía dưới.

```python
# %% [markdown]
# ### Phân đoạn 1: Khởi tạo dữ liệu và cấu hình thư viện
# Định nghĩa các Schema dữ liệu bằng Pydantic để đảm bảo tính nhất quán của dữ liệu truyền qua các Engine.

# %%
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import numpy as np

# Định nghĩa cấu trúc Claim
class Claim(BaseModel):
    id: str
    claim_statement: str
    entity: str
    category: str  # e.g., "Kinh tế", "Chính trị", "Y tế", "Xã hội"

# Định nghĩa cấu trúc Chứng cứ (Evidence)
class Evidence(BaseModel):
    id: str
    title: str
    content: str
    source_url: str
    source_type: str  # "Chinhphu", "BaoChi", "MXH"
    sentiment: str     # "Positive", "Negative", "Neutral"

# Giả lập dữ liệu đầu vào (Sau khi qua SmartReader OCR hoặc Biên tập viên nhập tay)
mock_claim = Claim(
    id="claim_001",
    entity="Bộ Tài chính",
    claim_statement="Bộ Tài chính đề xuất tăng thuế VAT lên 12% đối với tất cả mặt hàng tiêu dùng từ tháng sau.",
    category="Kinh tế"
)

# Giả lập dữ liệu chứng cứ thu thập được từ RSS/Cổng chính phủ và vnSocial
mock_evidences = [
    Evidence(
        id="ev_001",
        title="Cổng thông tin Bộ Tài chính",
        content="Bộ Tài chính khẳng định không có đề xuất tăng thuế VAT lên 12% trong kỳ họp tới. Các thông tin lan truyền trên mạng xã hội là thất thiệt.",
        source_url="https://mof.gov.vn/tin-tuc-su-kien",
        source_type="Chinhphu",
        sentiment="Neutral"
    ),
    Evidence(
        id="ev_002",
        title="Báo Tuổi Trẻ",
        content="Đại diện Bộ Tài chính bác bỏ tin đồn tăng thuế VAT lên 12%, khẳng định vẫn giữ nguyên lộ trình hỗ trợ thuế cho doanh nghiệp.",
        source_url="https://tuoitre.vn/bac-tin-don-tang-thue-vat-12",
        source_type="BaoChi",
        sentiment="Neutral"
    ),
    Evidence(
        id="ev_003",
        title="Bài đăng Facebook (vnSocial thu thập)",
        content="Nghe nói tháng sau tăng thuế VAT lên 12% rồi mọi người ơi, xăng dầu điện nước lại chuẩn bị lên giá nữa rồi, khổ quá!",
        source_url="https://facebook.com/share/p/123",
        source_type="MXH",
        sentiment="Negative"
    )
]

print(f"Claim cần kiểm chứng: '{mock_claim.claim_statement}'")
print(f"Số lượng chứng cứ thu thập được: {len(mock_evidences)}")
```

---

## Phân đoạn 2: Trích xuất Claim & Cấu trúc hóa Đầu ra với Gemini API

Sử dụng tính năng **Structured Outputs** của Gemini (thông qua thư viện Pydantic) để trích xuất các Claim từ văn bản thô một cách đáng tin cậy, tránh việc LLM phản hồi tự do không đúng định dạng.

```python
# %% [markdown]
# ### Phân đoạn 2: Trích xuất & Cấu trúc hóa thực thể bằng Gemini API
# Đoạn mã này mô phỏng cách gọi Gemini API bằng Python SDK, ép đầu ra trả về đúng định dạng JSON Schema của Pydantic.

# %%
# Cần cài đặt: pip install google-generativeai
import os
import google.generativeai as genai

# Cấu hình API Key (Giả lập)
# os.environ["GEMINI_API_KEY"] = "YOUR_API_KEY"
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "MOCK_KEY"))

class ClaimExtractionResult(BaseModel):
    entities: List[str] = Field(description="Danh sách các thực thể chính được nhắc đến")
    claims: List[Claim] = Field(description="Danh sách các tuyên bố cụ thể cần được kiểm chứng")

def extract_claims_from_text(raw_text: str) -> ClaimExtractionResult:
    # Đoạn prompt định hình nghiệp vụ báo chí Việt Nam
    prompt = f"""
    Bạn là chuyên gia kiểm tin của HypeRoom. Hãy phân tích đoạn văn bản sau và trích xuất các thực thể 
    cùng các tuyên bố (claims) mang tính khẳng định cần được đối chiếu kiểm chứng.
    
    Văn bản cần phân tích:
    \"\"\"{raw_text}\"\"\"
    """
    
    # Sử dụng model Gemini 2.5 Flash kết hợp Structured Output
    # (Đoạn code chạy thực tế sẽ gọi client.beta.chat.completions.create hoặc thư viện google-genai mới)
    print("[Gemini API Call] Đang trích xuất claims dưới định dạng JSON Schema...")
    
    # Mock output trả về đúng Schema để kiểm tra tính khả thi của luồng logic tiếp theo
    mock_extracted = ClaimExtractionResult(
        entities=["Bộ Tài chính", "Thuế VAT"],
        claims=[
            Claim(
                id="claim_001",
                claim_statement="Bộ Tài chính đề xuất tăng thuế VAT lên 12%",
                entity="Bộ Tài chính",
                category="Kinh tế"
            )
        ]
    )
    return mock_extracted

raw_input_text = "Mạng xã hội đang xôn xao trước thông tin Bộ Tài chính sắp đề xuất tăng thuế VAT lên 12% từ tháng sau."
extracted_data = extract_claims_from_text(raw_input_text)
print("Kết quả trích xuất cấu trúc hóa:")
print(extracted_data.model_dump_json(indent=2))
```

---

## Phân đoạn 2.1: Thu thập & Chuẩn hóa dữ liệu từ nguồn RSS chính thống

Phân đoạn này mô phỏng luồng dữ liệu thực tế: Đọc thẻ `<item>` từ RSS Feed của các báo (như VnExpress), trích xuất liên kết `<link>`, thực hiện tải HTML bất đồng bộ và sử dụng thư viện `trafilatura` để tách lọc lấy phần nội dung chính (body text) sạch sẽ, loại bỏ quảng cáo và menu thừa. Đây là bước chuẩn bị dữ liệu đầu vào tối quan trọng trước khi đưa vào Vector Database để tìm kiếm.

```python
# %% [markdown]
# ### Phân đoạn 2.1: Thu thập & Chuẩn hóa dữ liệu từ XML RSS và HTML
# Đoạn mã này mô phỏng cách trích xuất link từ RSS item của VnExpress, tải HTML và parse lấy nội dung văn bản chính.

# %%
# Cần cài đặt cho MVP: pip install trafilatura requests
import xml.etree.ElementTree as ET
import trafilatura

# Giả lập 1 XML item thực tế từ RSS Feed của VnExpress
rss_item_xml = """
<item>
    <title>Cuộc đời công chúa 'tài đức vẹn toàn' của Thái Lan</title>
    <description>
        <![CDATA[ <a href="https://vnexpress.net/cuoc-doi-cong-chua-tai-duc-ven-toan-cua-thai-lan-5084926.html"><img src="https://i1-vnexpress.vnecdn.net/2026/06/12/cong-chua-thai-lan-1781248101-9764-1781248222.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=62F6xtqA5IJBnSrPPKmhyQ"></a></br>Công chúa Bajrakitiyabha, người vừa qua đời ở tuổi 47 sau ba năm hôn mê, được ca ngợi là một trong những thành viên "tài đức vẹn toàn" nhất của Hoàng gia Thái Lan. ]]>
    </description>
    <pubDate>Fri, 12 Jun 2026 14:59:51 +0700</pubDate>
    <link>https://vnexpress.net/cuoc-doi-cong-chua-tai-duc-ven-toan-cua-thai-lan-5084926.html</link>
</item>
"""

def fetch_and_clean_article(url: str) -> str:
    """
    Tải trang HTML và sử dụng trafilatura để loại bỏ boilerplate (quảng cáo, sidebar, footer)
    chỉ giữ lại nội dung bài viết sạch dưới dạng plain text.
    """
    try:
        # Tải nội dung HTML từ URL
        html_content = trafilatura.fetch_url(url)
        if not html_content:
            return "Không thể tải nội dung HTML."
            
        # Lọc sạch mã HTML, lấy bài viết chính
        text_content = trafilatura.extract(html_content, output_format="txt")
        return text_content if text_content else "Không thể trích xuất văn bản từ HTML."
    except Exception as e:
        return f"Lỗi trong quá trình cào dữ liệu: {str(e)}"

# 1. Parse XML của RSS Item để trích xuất metadata và link chi tiết
root = ET.fromstring(rss_item_xml)
item_title = root.find("title").text
item_link = root.find("link").text
item_pubdate = root.find("pubDate").text

print("--- 1. ĐỌC THÔNG TIN TỪ RSS ITEM ---")
print(f"Tiêu đề: {item_title}")
print(f"Đường dẫn bài viết: {item_link}")
print(f"Thời gian xuất bản: {item_pubdate}")

# 2. Thực hiện cào nội dung chi tiết của link bài báo
print("\n--- 2. ĐANG CÀO NỘI DUNG CHI TIẾT TỪ LINK (HTTP FETCH & EXTRACT) ---")
article_body = fetch_and_clean_article(item_link)

# Hiển thị 500 ký tự đầu tiên của nội dung bài viết sạch thu thập được
print(f"Độ dài nội dung thu thập: {len(article_body)} ký tự")
print(f"Nội dung sạch (Demo 500 ký tự đầu):\n\"\"\"\n{article_body[:500]}...\n\"\"\"")
```

---

## Phân đoạn 2a: Cơ chế thu thập & Truy xuất Chứng cứ (Evidence Retrieval Layer - No Full Table Scan)

Phân đoạn này mô phỏng cách thức HypeRoom lưu trữ tri thức chính thống, chuyển hóa ngữ nghĩa thành Vector chỉ mục, và thực hiện truy vấn khoảng cách vector (ANN) thông qua một Vector Database (ví dụ Qdrant / Milvus) cục bộ thay vì quét toàn bộ bảng dữ liệu. Giải pháp này sử dụng thư viện `sentence-transformers` cực kỳ tối ưu, dễ dàng hoàn thành trong 2 tuần chạy MVP.

```python
# %% [markdown]
# ### Phân đoạn 2a: Vectorization & Tìm kiếm tương đồng ngữ nghĩa (Semantic Search)
# Đoạn mã này sử dụng thư viện sentence-transformers để mã hóa (embed) các tài liệu chính thống,
# giả lập lưu trữ vào Vector DB và truy xuất Top-K chứng cứ liên quan nhất mà không cần scan text bằng LIKE '%...%'.

# %%
# Cần cài đặt cho MVP: pip install sentence-transformers numpy
from sentence_transformers import SentenceTransformer
import numpy as np

# Sử dụng mô hình embedding gọn nhẹ chuyên dụng cho Tiếng Việt để chạy cực mượt trên CPU trong MVP
# Ví dụ: "keepitreal/vietnamese-sbert" hoặc "bmd1905/vietnamese-bi-encoder-semantic-search"
# Tải và khởi tạo mô hình nhúng (Chỉ mất khoảng 1-2 phút trong lần chạy đầu tiên)
try:
    embedder = SentenceTransformer("keepitreal/vietnamese-sbert")
    has_embedder = True
except Exception as e:
    print(f"Không thể tải model nhúng thực tế: {e}. Hệ thống sẽ dùng mock vectors.")
    has_embedder = False

# Giả lập Cổng Tri thức chính thống (Knowledge Base) đã được chuẩn hóa lưu trữ
# Trong thực tế MVP, đây là bảng 'evidences_vector' trên Qdrant/Milvus
knowledge_base = [
    {
        "id": "doc_gov_01",
        "title": "Bác bỏ tin đồn tăng thuế VAT",
        "content": "Bộ Tài chính khẳng định không đề xuất tăng thuế VAT lên 12% hay bất kỳ mức điều chỉnh nào khác.",
        "source_type": "Chinhphu"
    },
    {
        "id": "doc_gov_02",
        "title": "Họp báo thường kỳ chính phủ",
        "content": "Chính phủ chỉ đạo tập trung giữ ổn định giá xăng dầu, hỗ trợ doanh nghiệp phục hồi sản xuất.",
        "source_type": "Chinhphu"
    },
    {
        "id": "doc_news_01",
        "title": "Thông tin thuế xuất nhập khẩu",
        "content": "Nghị định mới của Chính phủ hướng dẫn chi tiết thuế suất ưu đãi đối với các mặt hàng linh kiện điện tử nhập khẩu.",
        "source_type": "BaoChi"
    }
]

# 1. Pipeline nhúng tri thức (Lưu trữ Vector)
# Trong production, bước này diễn ra bất đồng bộ mỗi khi worker cào được tin RSS mới
kb_vectors = []
if has_embedder:
    print("\n--- ĐANG MÃ HÓA KHO TRI THỨC VÀO VECTOR DB ---")
    for doc in knowledge_base:
        # Nhúng tiêu đề + nội dung thành vector 768 chiều
        vector = embedder.encode(f"{doc['title']}: {doc['content']}")
        kb_vectors.append(vector)
    kb_vectors = np.array(kb_vectors)
    print(f"Đã vector hóa {len(knowledge_base)} văn bản chính thống.")

# 2. Pipeline truy xuất khi nhận được Claim (Retrieval - Không scan bảng)
def retrieve_top_evidences(query_claim: str, top_k: int = 2) -> List[Dict]:
    print(f"\n--- TRUY XUẤT CHỨNG CỨ CHO: '{query_claim}' ---")
    
    if not has_embedder:
        # Mock kết quả trả về nếu không chạy model
        return [knowledge_base[0]]
        
    # Bước A: Nhúng câu claim của người dùng thành vector truy vấn
    query_vector = embedder.encode(query_claim)
    
    # Bước B: Tính Cosine Similarity giữa câu truy vấn và kho dữ liệu (ANN search giả lập)
    # Trong DB Qdrant/Milvus, truy vấn này được chạy trực tiếp bằng phương thức search() tối ưu hóa thời gian dưới 10ms
    scores = np.dot(kb_vectors, query_vector) / (np.linalg.norm(kb_vectors, axis=1) * np.linalg.norm(query_vector))
    
    # Bước C: Sắp xếp lấy Top-K tài liệu có điểm tương đồng cao nhất
    top_indices = np.argsort(scores)[::-1][:top_k]
    
    results = []
    for idx in top_indices:
        doc = knowledge_base[idx].copy()
        doc["semantic_similarity_score"] = float(scores[idx])
        results.append(doc)
        
    return results

# Chạy thử nghiệm truy xuất chứng cứ ngữ nghĩa cho Claim của Bộ Tài chính
retrieved_docs = retrieve_top_evidences("Bộ Tài chính đề xuất tăng thuế VAT lên 12%")
for rank, doc in enumerate(retrieved_docs):
    print(f"Top {rank+1}: {doc['title']} (Nguồn: {doc['source_type']}) | Similarity Score: {doc.get('semantic_similarity_score', 0.0):.4f}")
    print(f" -> Nội dung: {doc['content']}\n")
```

---


## Phân đoạn 3: Phân loại rủi ro nhạy cảm cục bộ (PhoBERT / HuggingFace Pipeline)

Thay vì gọi API Gemini (chậm và tốn chi phí) chỉ để phân loại xem văn bản thuộc chủ đề nhạy cảm nào, ta sử dụng một mô hình BERT tiếng Việt nhỏ chạy local.

```python
# %% [markdown]
# ### Phân đoạn 3: Phân loại chủ đề nhạy cảm chạy Local với Transformers
# Sử dụng pipeline phân loại văn bản (Text Classification) để phát hiện sớm các nội dung có yếu tố nhạy cảm.

# %%
# Cần cài đặt: pip install transformers torch
from transformers import pipeline

# Sử dụng một mô hình phân loại Tiếng Việt có sẵn trên HuggingFace Hub 
# Hoặc một mô hình PhoBERT đã được fine-tune riêng cho tác vụ phân loại nội dung nhạy cảm của tòa soạn.
try:
    # Ở đây chúng ta khởi tạo một pipeline Zero-shot Classification hoặc Text-Classification
    # Để minh họa, ta giả định sử dụng mô hình phân loại cảm xúc/chủ đề tiếng Việt
    classifier = pipeline(
        "text-classification", 
        model="bmd1905/vietnamese-bi-encoder-semantic-search", # Thay bằng model phân loại chuyên dụng khi triển khai
        device=-1 # Chạy trên CPU
    )
    has_model = True
except Exception as e:
    print(f"Bỏ qua tải model thực tế do chưa cài đặt thư viện: {e}")
    has_model = False

def classify_sensitive_topic(text: str) -> Dict[str, float]:
    if not has_model:
        # Trả về kết quả giả lập nếu không có kết nối tải model
        return {"Chính trị/Pháp luật": 0.15, "Kinh tế/Thuế": 0.85, "An ninh trật tự": 0.05}
    
    # Thực hiện phân loại văn bản thực tế
    result = classifier(text)
    return {res['label']: res['score'] for res in result}

sensitive_scores = classify_sensitive_topic(mock_claim.claim_statement)
print("Điểm phân loại chủ đề nhạy cảm (Local Model):")
for topic, score in sensitive_scores.items():
    print(f" - {topic}: {score:.2%}")
```

---

## Phân đoạn 3a: Đối chiếu và Phân tích kiểm chứng (Semantic Alignment & Verification)

Phân đoạn này thực hiện so sánh nội dung logic giữa Tuyên bố (Claim) và từng Chứng cứ (Evidence).
Ta sử dụng một mô hình NLI (Natural Language Inference) hoặc Prompt Gemini để gán nhãn trạng thái đối chiếu chéo:
- **SUPPORT** (Đồng thuận/Xác nhận) -> `alignment_score = 1.0`
- **CONTRADICT** (Mâu thuẫn/Bác bỏ) -> `alignment_score = -1.0`
- **NEUTRAL** (Không liên quan/Chưa rõ) -> `alignment_score = 0.0`

```python
# %% [markdown]
# ### Phân đoạn 3a: Đối chiếu và Phân tích kiểm chứng (Semantic Alignment & Verification)
# Phân đoạn này thực hiện so sánh nội dung logic giữa Tuyên bố (Claim) và từng Chứng cứ (Evidence).

# %%
def verify_claim_against_evidence(claim: Claim, evidence: Evidence) -> Dict[str, any]:
    """
    Sử dụng mô hình NLI để so sánh sự tương đương logic giữa Claim và Evidence.
    Ở đây demo sử dụng prompt kiểm chứng logic nghiêm ngặt với Gemini 2.5.
    """
    prompt = f"""
    Bạn là hệ thống kiểm chứng tin tức tự động. Hãy so khớp Tuyên bố dưới đây với Chứng cứ được cung cấp.
    
    Tuyên bố (Claim): "{claim.claim_statement}"
    Chứng cứ (Evidence): "{evidence.content}"
    
    Hãy phân tích mối quan hệ logic giữa Tuyên bố và Chứng cứ:
    1. Chứng cứ này ỦNG HỘ (SUPPORT), BÁC BỎ (CONTRADICT) hay TRUNG LẬP/CHƯA ĐỦ THÔNG TIN (NEUTRAL) đối với tuyên bố trên?
    2. Đánh giá điểm tương đồng ngữ nghĩa (Semantic Alignment Score) từ -1.0 (mâu thuẫn hoàn toàn) đến 1.0 (trùng khớp hoàn toàn).
    
    Trả về kết quả dưới định dạng JSON với cấu trúc:
    {{
        "verdict": "SUPPORT" | "CONTRADICT" | "NEUTRAL",
        "alignment_score": float,
        "reason": "Lập luận phân tích ngắn gọn"
    }}
    """
    
    print(f"[Verification API] Đang kiểm chứng Claim với Evidence ID: {evidence.id}...")
    
    # Giả lập kết quả trả về từ logic kiểm định ngữ nghĩa thực tế:
    if evidence.id == "ev_001":
        return {
            "verdict": "CONTRADICT",
            "alignment_score": -1.0,
            "reason": "Cổng thông tin Bộ Tài chính khẳng định hoàn toàn KHÔNG có đề xuất này."
        }
    elif evidence.id == "ev_002":
        return {
            "verdict": "CONTRADICT",
            "alignment_score": -0.9,
            "reason": "Đại diện Bộ Tài chính đã bác bỏ tin đồn này trên báo Tuổi Trẻ."
        }
    else:
        return {
            "verdict": "SUPPORT",
            "alignment_score": 1.0,
            "reason": "Bài đăng trên MXH đang trực tiếp lan truyền tuyên bố này."
        }

# Chạy thử nghiệm verify cho từng chứng cứ để lấy điểm Alignment thực tế
alignment_results = {}
for ev in mock_evidences:
    res = verify_claim_against_evidence(mock_claim, ev)
    alignment_results[ev.id] = res
    print(f" -> Kết quả: {res['verdict']} | Score: {res['alignment_score']} | Lý do: {res['reason']}\n")
```

---

## Phân đoạn 4: Đánh giá định lượng Trust Score & Risk Score (Heuristic Algorithm)

Kết hợp các chỉ số định lượng bao gồm: Trọng số nguồn tin cậy (Source Weights), Chỉ số lan truyền mạng xã hội (Impact Score từ vnSocial) và điểm Alignment vừa tính được ở Phân đoạn 3a để tính toán điểm số cuối cùng.

```python
# %% [markdown]
def calculate_trust_score(claim: Claim, evidences: List[Evidence], alignments: Dict[str, Dict]) -> float:
    """
    Tính Trust Score dựa trên đối chiếu chéo nguồn tin thực tế từ kết quả phân tích NLI ở bước trước.
    """
    source_weights = {
        "Chinhphu": 1.0,
        "BaoChi": 0.8,
        "MXH": 0.3
    }
    
    weighted_score_sum = 0.0
    weight_sum = 0.0
    
    for ev in evidences:
        w = source_weights.get(ev.source_type, 0.3)
        alignment_data = alignments.get(ev.id, {"alignment_score": 0.0})
        alignment = alignment_data["alignment_score"]
        
        # Công thức tích hợp trọng số nguồn
        weighted_score_sum += alignment * w
        weight_sum += w
        
    # Chuẩn hóa điểm số về thang 0 - 100
    avg_alignment = weighted_score_sum / weight_sum if weight_sum > 0 else 0
    trust_score = max(0.0, min(100.0, (avg_alignment + 1) * 50)) # Chuyển đổi từ [-1, 1] sang [0, 100]
    return round(trust_score, 2)

def evaluate_publishing_risk(trust_score: float, impact_score: float) -> Dict[str, any]:
    """
    Tính toán mức độ rủi ro xuất bản (Risk Level) dựa trên Trust Score và Impact Score.
    """
    # Công thức Heuristic xác định điểm rủi ro (0 - 100)
    risk_index = (100 - trust_score) * 0.6 + impact_score * 0.4
    
    if risk_index >= 70:
        level = "HIGH"
        warning = "Cảnh báo đỏ: Thông tin có độ sai lệch cao đang lan truyền mạnh. KHÔNG xuất bản trực tiếp, cần bài viết định hướng dư luận."
    elif risk_index >= 40:
        level = "MEDIUM"
        warning = "Cảnh báo vàng: Thông tin chưa được kiểm chứng rõ ràng hoặc có phản ứng trái chiều từ dư luận."
    else:
        level = "LOW"
        warning = "Thông tin an toàn hoặc đã được đính chính rõ ràng bởi các cơ quan thẩm quyền."
        
    return {
        "risk_index": round(risk_index, 2),
        "risk_level": level,
        "warning_message": warning
    }

trust_score = calculate_trust_score(mock_claim, mock_evidences, alignment_results)
risk_report = evaluate_publishing_risk(trust_score, mock_impact_score)

print(f"--- KẾT QUẢ ĐÁNH GIÁ ĐỊNH LƯỢNG ---")
print(f"Trust Score (Độ tin cậy): {trust_score}/100")
print(f"vnSocial Impact Score (Độ lan truyền): {mock_impact_score}/100")
print(f"Risk Index (Điểm rủi ro): {risk_report['risk_index']}/100")
print(f"Phân cấp rủi ro: {risk_report['risk_level']}")
print(f"Khuyến nghị: {risk_report['warning_message']}")
```

---

## Phân đoạn 5: Advanced RAG với Gemini (Editorial Generator)

Chuyển dữ liệu đã kiểm chứng, báo cáo rủi ro và các tài liệu nguồn chính thống đã được sắp xếp độ liên quan vào Prompt để sinh ra Outline bài viết hoàn chỉnh và an toàn.

```python
# %% [markdown]
# ### Phân đoạn 5: Advanced RAG & Sinh Outline bài viết an toàn bằng Gemini
# Tổng hợp toàn bộ dữ liệu đã tính toán ở các bước trước để làm ngữ cảnh đầu vào, yêu cầu LLM viết Outline.

# %%
def generate_editorial_outline(claim: Claim, trust_score: float, risk_report: Dict, evidences: List[Evidence]) -> str:
    # Lọc ra các nguồn chính thống để làm tài liệu tham chiếu (Context)
    official_sources = [ev for ev in evidences if ev.source_type in ["Chinhphu", "BaoChi"]]
    
    context_str = ""
    for idx, ev in enumerate(official_sources):
        context_str += f"Tài liệu tham chiếu {idx+1}:\n"
        context_str += f"- Nguồn: {ev.title} ({ev.source_type})\n"
        context_str += f"- Nội dung: {ev.content}\n\n"
        
    prompt = f"""
    Bạn là Trợ lý biên tập cao cấp của tòa soạn HypeRoom. Hãy xây dựng một đề cương bài viết (Outline) để định hướng thông tin dư luận.
    
    Yêu cầu:
    1. Bám sát các thông tin từ các nguồn tài liệu chính thống dưới đây. Tuyệt đối không tự bịa đặt thông tin nằm ngoài ngữ cảnh (Không ảo giác).
    2. Cảnh báo rủi ro hiện tại: {risk_report['risk_level']} (Điểm rủi ro: {risk_report['risk_index']}/100).
    3. Định hướng bài viết cần trung thực, khách quan và đính chính các tin đồn thất thiệt.
    
    Thông tin cần xử lý:
    - Tin đồn cần đính chính: {claim.claim_statement}
    
    {context_str}
    
    Hãy trả ra kết quả theo cấu trúc:
    - Tiêu đề gợi ý (Story Angles)
    - Sapo bài viết
    - Thân bài (Phân chia các mục cụ thể kèm nguồn đối chiếu tương ứng)
    - Kết luận
    """
    
    print("[Gemini API Call] Đang sinh đề cương bài viết an toàn dựa trên ngữ cảnh đã xác thực...")
    
    # Mock kết quả phản hồi từ Gemini
    mock_outline = f"""
    ### ĐỀ CƯƠNG BÀI VIẾT ĐỀ XUẤT:
    
    **1. Tiêu đề gợi ý:**
    - Thực hư thông tin tăng thuế VAT lên 12% từ tháng sau.
    - Bộ Tài chính lên tiếng về tin đồn điều chỉnh thuế suất VAT.
    
    **2. Đoạn Sapo:**
    Trước những tin đồn lan truyền trên các mạng xã hội về việc tăng thuế giá trị gia tăng (VAT) lên 12%, Bộ Tài chính đã chính thức lên tiếng bác bỏ thông tin này, khẳng định đây là tin đồn thất thiệt không có cơ sở.
    
    **3. Thân bài:**
    - *Mục 1: Sự thật về tin đồn lan truyền trên mạng xã hội*
      - Nêu lại bối cảnh tin đồn xuất phát từ các diễn đàn tự phát (Đối chiếu: Chứng cứ vnSocial).
    - *Mục 2: Phản hồi chính thức từ Bộ Tài chính*
      - Trích dẫn khẳng định từ Cổng thông tin Bộ Tài chính: Không có đề xuất thay đổi thuế suất trong kỳ họp này (Đối chiếu: Cổng thông tin Bộ Tài chính).
    - *Mục 3: Khuyến cáo người dân và doanh nghiệp*
      - Khuyên người đọc cần tiếp cận thông tin từ các nguồn báo chí chính thống, tránh bị các đối tượng xấu dẫn dắt tâm lý (Đối chiếu: Báo Tuổi Trẻ).
      
    **4. Kết luận:**
    Thuế VAT vẫn giữ nguyên theo lộ trình hiện hành nhằm hỗ trợ phục hồi kinh tế. Tòa soạn khuyến cáo biên tập viên gắn kèm Audit Trail mã kiểm định tin tức của HypeRoom khi xuất bản.
    """
    return mock_outline

editorial_result = generate_editorial_outline(mock_claim, trust_score, risk_report, mock_evidences)
print(editorial_result)
```
