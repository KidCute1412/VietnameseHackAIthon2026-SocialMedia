# UC4: Truy xuất chứng cứ nguồn chéo (Evidence Retrieval)

## 1. Tóm tắt
Thực hiện truy xuất thông tin chứng cứ để đối chiếu chéo cho từng claim. Trong giai đoạn MVP, hệ thống không sử dụng Vector DB hay pgvector mà thực hiện tìm kiếm trực tuyến đa nguồn trên các trang báo chí uy tín (qua Tavily Search API), sau đó cào văn bản sạch, lọc, dedupe và chọn lọc chứng cứ tốt nhất ở backend trước khi gửi sang SmartBot.

## 2. Actors
*   **Hệ thống (Evidence Retrieval Engine - Backend)**.
*   **Tavily Search API**: Công cụ tìm kiếm trực tuyến có định hướng.
*   **Scraper (Trafilatura)**: Bộ lọc tách văn bản sạch từ website.
*   **PostgreSQL**: Cơ sở dữ liệu quan hệ lưu trữ claims và evidences phục vụ lưu vết và audit.

## 3. Luồng xử lý chính (Basic Flow)
1.  **Nhận Claims**: Lặp qua danh sách claims cần đối chiếu.
2.  **Tạo Query**: Với mỗi claim, backend tạo câu lệnh tìm kiếm tối ưu.
3.  **Tìm kiếm trực tuyến (Online Search)**:
    *   Gọi API **Tavily Search** gửi nội dung claim làm câu lệnh tìm kiếm.
    *   Giới hạn các tên miền uy tín thông qua tham số `include_domains` (`chinhphu.vn`, `nhandan.vn`, `tuoitre.vn`, `vtv.vn`, `vnexpress.net`,...).
4.  **Cào và Làm sạch (Web Scraping)**:
    *   Lấy các liên kết (URL) được trả về từ Tavily.
    *   Sử dụng thư viện `Trafilatura` để cào nội dung chi tiết bài viết sạch (loại bỏ quảng cáo, menu điều hướng).
5.  **Lọc và Chuẩn hóa (Backend Filtering & Deduplication)**:
    *   Backend tự động lọc nguồn rác, loại bỏ các kết quả trùng lặp (deduplicate) và xếp hạng để chọn ra các chứng cứ (evidences) tốt nhất.
6.  **Lưu vết chứng cứ**:
    *   Lưu các đoạn text chứng cứ, link URL, tên nguồn và metadata ngày xuất bản vào bảng `evidences` trong PostgreSQL.

## 4. Ngoại lệ & Thay thế (Alternative Flows)
*   **Tavily hết quota / API lỗi**:
    *   Hệ thống chuyển sang chế độ Mock dữ liệu chứng cứ nếu `MOCK_MODE=true`.
    *   Ghi log cảnh báo và đánh dấu trạng thái pipeline là `warning` (vẫn chạy tiếp bằng dữ liệu fallback/mock).
*   **Tên miền bị chặn cào (Scraper Blocked)**:
    *   Nếu `Trafilatura` không thể cào bài viết gốc do Cloudflare hoặc cấu hình chặn robot, hệ thống sẽ sử dụng phần tóm tắt ngắn (snippets) do Tavily API cung cấp làm dữ liệu chứng cứ tạm thời.

## 5. Ràng buộc MVP
*   Không tìm kiếm tràn lan; bắt buộc phải lọc theo danh sách whitelist domains được cấu hình sẵn để tránh lấy thông tin rác từ mạng xã hội hoặc blog cá nhân.
*   Cơ chế RAG phải giữ được liên kết (URL) gốc để hiển thị minh bạch cho người dùng cuối bấm kiểm tra nguồn.
*   Tránh tích hợp Vector DB (`pgvector`, `vietnamese-sbert`) trong khâu retrieval của MVP để tối ưu hóa thời gian triển khai; các thành phần này được coi là hướng phát triển dài hạn sau MVP.
