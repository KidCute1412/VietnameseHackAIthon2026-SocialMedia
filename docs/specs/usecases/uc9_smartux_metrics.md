# UC9: Tích hợp VNPT SmartUX & Ghi nhận chỉ số tương tác (UX Metrics Logging)

## 1. Tóm tắt
Hệ thống tích hợp SDK VNPT SmartUX ở mức tối thiểu để thu thập các chỉ số tương tác và hành vi sử dụng của Biên tập viên trên giao diện Dashboard, giúp đo lường hiệu năng tác nghiệp và tối ưu hóa giao diện.

## 2. Actors
*   **Biên tập viên (BTV) / Người duyệt bài**.
*   **VNPT SmartUX SDK / API**: Nền tảng ghi nhận và phân tích trải nghiệm người dùng.

## 3. Luồng xử lý chính (Basic Flow)
1.  **Khởi tạo SDK**: Khi BTV truy cập vào ứng dụng, SmartUX SDK được tải và khởi tạo ở phía Client.
2.  **Lắng nghe sự kiện (Event Listening)**: SDK tự động thu thập các số liệu hiệu năng cơ bản:
    *   Thời gian hoàn tất tác vụ xác minh (từ lúc gửi đến lúc nhận kết quả).
    *   Tốc độ phản hồi của trợ lý ảo SmartBot.
3.  **Ghi nhận hành động chủ động**: Khi người dùng tương tác, Client gửi các sự kiện tùy biến (Custom Events):
    *   Sự kiện "Click Copy Đề Cương" (`copy_editorial_outline`).
    *   Sự kiện "Gửi phản hồi hiệu chỉnh" (`submit_human_feedback`).
4.  **Đẩy metric về VNPT SmartUX**: Các sự kiện được đóng gói và gửi bất đồng bộ về API của VNPT SmartUX để phân tích.

## 4. Ngoại lệ & Thay thế (Alternative Flows)
*   **Mất kết nối API SmartUX / Chặn SDK (Ad-blocker)**:
    *   Nếu SDK không thể tải hoặc bị chặn, Client hoạt động bình thường mà không gây đứt gãy luồng nghiệp vụ chính của Dashboard.
    *   Các sự kiện tương tác sẽ được ghi nhận tạm thời vào Console Log dưới dạng debug nếu bật chế độ phát triển.

## 5. Ràng buộc MVP
*   Tích hợp ở mức tối giản (minimal path), không gây ảnh hưởng đến thời gian tải trang ban đầu (Page Load Time).
*   Chỉ ghi nhận các sự kiện ẩn danh, không thu thập thông tin cá nhân nhạy cảm để đảm bảo an toàn thông tin.
