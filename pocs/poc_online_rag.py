import os
import sys
try:
    from ddgs import DDGS
except ImportError:
    from duckduckgo_search import DDGS
import trafilatura

# Danh sách các trang báo chính thống tại Việt Nam để lọc kết quả đáng tin cậy
TRUSTED_DOMAINS = [
    "chinhphu.vn",
    "nhandan.vn",
    "tuoitre.vn",
    "thanhnien.vn",
    "vietnamnet.vn",
    "vtv.vn",
    "vnexpress.net"
]

def extract_article_content(url: str) -> str:
    """
    Sử dụng trafilatura để tải trang và trích xuất nội dung văn bản sạch của bài báo.
    """
    print(f"  -> Đang cào & trích xuất nội dung từ: {url}...")
    try:
        downloaded = trafilatura.fetch_url(url)
        if downloaded:
            text = trafilatura.extract(downloaded)
            if text:
                return text.strip()
    except Exception as e:
        print(f"     Lỗi trích xuất: {e}")
    return "Không thể trích xuất nội dung bài viết."

def is_likely_article(url: str) -> bool:
    """
    Kiểm tra xem URL có khả năng là bài báo cụ thể hay chỉ là trang danh mục/mục lục/trang chủ.
    """
    from urllib.parse import urlparse
    parsed = urlparse(url)
    path = parsed.path.strip("/")
    
    # 1. Bỏ qua trang chủ
    if not path:
        return False
        
    # 2. Bỏ qua các URL chứa từ khóa mục lục phổ biến
    ignore_keywords = ["/category/", "/chuyen-muc/", "/tags/", "/search/", "/lien-he/", "sitemap", "index.html", "index.htm"]
    for kw in ignore_keywords:
        if kw in url.lower():
            return False
            
    # 3. Phân tích cấu trúc dẫn đường (path)
    parts = path.split("/")
    
    # Nếu chỉ có 1 cấp thư mục và không phải file bài viết (.html/.htm) hoặc slug quá ngắn, khả năng cao là trang danh mục
    if len(parts) == 1:
        filename = parts[0]
        is_article_file = filename.endswith(".html") or filename.endswith(".htm") or filename.endswith(".shtml")
        if not is_article_file and len(filename) < 25:
            return False
            
    return True

def search_trusted_sources(query: str, max_results: int = 3):
    """
    Tìm kiếm trên DuckDuckGo và lọc ra các kết quả thuộc trang web chính thống.
    Nếu tìm kiếm cả câu không ra kết quả, tự động đơn giản hóa câu truy vấn thành các từ khóa chính.
    """
    print(f"\n[1/2] Đang tìm kiếm liên kết đáng tin cậy cho: '{query}'...")
    
    evidences = []
    
    # Danh sách các câu truy vấn để thử (từ cụ thể đến khái quát)
    queries_to_try = [query]
    
    # Tự động tạo câu truy vấn từ khóa ngắn hơn (ví dụ: lấy 8 từ đầu tiên nếu quá dài)
    words = query.split()
    if len(words) > 8:
        short_query = " ".join(words[:8])
        queries_to_try.append(short_query)
        # Thêm phương án từ khóa cốt lõi
        core_keywords = " ".join([w for w in words if w[0].isupper() or w.lower() in ["căn cước", "chip", "áp dụng", "tháng 7"]])
        if core_keywords and core_keywords != query:
            queries_to_try.append(core_keywords)

    for q in queries_to_try:
        if not q.strip():
            continue
        print(f"  -> Thử tìm kiếm với từ khóa: '{q}'...")
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(q, max_results=20))
                if results:
                    for r in results:
                        href = r.get("href", "")
                        
                        # Chỉ lấy link thuộc domain tin cậy VÀ là bài viết cụ thể (không lấy trang mục lục)
                        is_trusted = any(domain in href for domain in TRUSTED_DOMAINS)
                        if is_trusted and is_likely_article(href):
                            evidences.append({
                                "title": r.get("title"),
                                "link": href,
                                "snippet": r.get("body")
                            })
                            print(f"    * Tìm thấy bài viết chi tiết (Whitelist): {r.get('title')} ({href})")
                            if len(evidences) >= max_results:
                                return evidences
                                
                    # Nếu đã duyệt hết các phương án tìm kiếm mà vẫn không đủ số whitelist mong muốn
                    if evidences:
                        return evidences
        except Exception as e:
            print(f"  Lỗi khi tìm kiếm với '{q}': {e}")
            
    # Fallback cuối cùng nếu không tìm được bài viết chính thống nào
    if not evidences:
        print("    [!] Không tìm thấy bài viết chính thống nào, lấy các nguồn hàng đầu:")
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=5))
                for r in results[:max_results]:
                    evidences.append({
                        "title": r.get("title"),
                        "link": r.get("href"),
                        "snippet": r.get("body")
                    })
                    print(f"    * Tự động lấy: {r.get('title')} ({r.get('href')})")
        except Exception as e:
            print(f"  Lỗi fallback: {e}")
            
    return evidences



def save_extraction_report(news_text: str, evidences: list):
    """
    Trích xuất toàn bộ nội dung của các link bài báo và lưu vào file Markdown.
    """
    print(f"\n[2/2] Bắt đầu trích xuất nội dung bài viết bằng Trafilatura...")
    report_path = os.path.join(os.path.dirname(__file__), "verification_report.md")
    
    markdown_content = f"""# Báo Cáo Trích Xuất Dẫn Chứng Tin Tức

**Tin tức đầu vào cần đối chiếu:** 
> {news_text}

---

## Danh Sách Bài Báo Đối Chiếu & Nội Dung Chi Tiết
"""

    if evidences:
        for idx, ev in enumerate(evidences):
            full_text = extract_article_content(ev['link'])
            # Định dạng nội dung bài báo, cắt ngắn bớt nếu quá dài để báo cáo dễ đọc
            preview_text = full_text[:1500] + "\n\n*(Xem tiếp nội dung bài báo gốc ở link phía trên...)*" if len(full_text) > 1500 else full_text
            
            markdown_content += f"""
### Dẫn chứng [{idx+1}]: {ev['title']}
*   **Nguồn liên kết:** [{ev['link']}]({ev['link']})
*   **Tóm tắt tìm kiếm (Snippet):** 
    > {ev['snippet']}
*   **Nội dung chi tiết trích xuất được (Full-text):**
```text
{preview_text}
```

---
"""
    else:
        markdown_content += "\n*Không tìm thấy bài viết liên quan trên internet.*\n"

    try:
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(markdown_content)
        print(f"\n[OK] Đã hoàn thành! Báo cáo trích xuất chi tiết tại: {report_path}")
    except Exception as e:
        print(f"Lỗi khi ghi báo cáo: {e}")

if __name__ == "__main__":
    # Đăng ký thư viện cần thiết trước khi chạy: `pip install ddgs trafilatura`
    
    sample_news = "Bộ Công an vừa ban hành mẫu thẻ Căn cước mới có gắn chip và mã QR bắt đầu áp dụng từ tháng 7 năm nay"
    
    # 1. Tìm kiếm nguồn tin chính thống trực tuyến
    found_evidences = search_trusted_sources(sample_news, max_results=2)
    
    # 2. Trích xuất nội dung chi tiết bài viết và lưu báo cáo
    save_extraction_report(sample_news, found_evidences)
