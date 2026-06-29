import os
import sys
import requests
import trafilatura
from dotenv import load_dotenv

# Tải các biến môi trường từ tệp .env
load_dotenv()

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

def search_trusted_sources(query: str, max_results: int = 3):
    """
    Tìm kiếm sử dụng Tavily API và lọc ra các kết quả thuộc trang web chính thống Việt Nam.
    Nếu không cấu hình TAVILY_API_KEY trong env, sẽ trả về kết quả giả lập (Mock).
    """
    tavily_api_key = os.getenv("TAVILY_API_KEY", "MOCK_TAVILY_API_KEY")
    
    print(f"\n[1/2] Đang tìm kiếm liên kết đáng tin cậy bằng Tavily cho: '{query}'...")
    
    if tavily_api_key == "MOCK_TAVILY_API_KEY":
        print("  [!] Chưa tìm thấy TAVILY_API_KEY trong môi trường. Sử dụng dữ liệu giả lập (Mock)...")
        return [
            {
                "title": "Bộ Công an ban hành mẫu thẻ Căn cước mới áp dụng từ tháng 7",
                "link": "https://chinhphu.vn/bo-cong-an-mau-the-can-cuoc-moi-tu-thang-7",
                "snippet": "Từ tháng 7 năm nay, Bộ Công an chính thức áp dụng mẫu thẻ căn cước mới có gắn chip tích hợp mã QR..."
            },
            {
                "title": "Điểm mới trên mẫu thẻ Căn cước áp dụng từ năm 2026",
                "link": "https://vtv.vn/xa-hoi/mau-the-can-cuoc-moi-2026",
                "snippet": "Mẫu thẻ căn cước mới kế thừa các ưu điểm của thẻ căn cước công dân gắn chip cũ nhưng bổ sung thông tin sinh trắc học..."
            }
        ]
        
    url = "https://api.tavily.com/search"
    payload = {
        "api_key": tavily_api_key,
        "query": query,
        "search_depth": "basic",
        "max_results": max_results,
        # Sử dụng tính năng lọc tên miền chính thống trực tiếp từ API của Tavily
        "include_domains": TRUSTED_DOMAINS
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            results = response.json().get("results", [])
            evidences = []
            for r in results:
                evidences.append({
                    "title": r.get("title"),
                    "link": r.get("url"),
                    "snippet": r.get("content")
                })
                print(f"    * Tavily tìm thấy: {r.get('title')} ({r.get('url')})")
            return evidences
        else:
            print(f"  [!] Tavily API lỗi: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"  [!] Kết nối đến Tavily thất bại: {e}")
        
    return []

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
    # Yêu cầu cài đặt thư viện cần thiết trước khi chạy: `pip install requests trafilatura`
    
    sample_news = "Bộ Công an vừa ban hành mẫu thẻ Căn cước mới có gắn chip và mã QR bắt đầu áp dụng từ tháng 7 năm nay"
    
    # 1. Tìm kiếm nguồn tin chính thống trực tuyến qua Tavily API
    found_evidences = search_trusted_sources(sample_news, max_results=2)
    
    # 2. Trích xuất nội dung chi tiết bài viết và lưu báo cáo
    save_extraction_report(sample_news, found_evidences)
