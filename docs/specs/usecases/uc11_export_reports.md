# UC11: Kết xuất báo cáo và Đề cương tác nghiệp (Export Reports)

## 1. Tóm tắt
Cho phép Biên tập viên và Người duyệt bài xuất bản báo cáo phân tích kiểm chứng và đề cương bài viết ra các định dạng chuẩn hóa (như PDF hoặc file Markdown) để chia sẻ nhanh hoặc lưu trữ ngoại tuyến.

## 2. Actors
*   **Biên tập viên (BTV) / Người duyệt bài**.
*   **Hệ thống (Export Engine)**.

## 3. Luồng xử lý chính (Basic Flow)
1.  **Yêu cầu Xuất bản**: Tại trang chi tiết của một phiên xác minh, người dùng bấm chọn nút "Xuất báo cáo PDF" hoặc "Tải Đề Cương (.md)".
2.  **Đóng gói dữ liệu**: Client gửi yêu cầu đến server. Server tập hợp toàn bộ thông tin bao gồm:
    *   Nội dung gốc cần xác minh.
    *   Danh sách Claims đã bóc tách kèm kết quả Trust Score.
    *   Báo cáo rủi ro pháp lý & mức độ rủi ro (Risk Level).
    *   Tập chứng cứ đối chứng (Evidences) kèm link nguồn.
    *   Dàn ý đề cương bài viết đề xuất (Editorial Outline).
3.  **Tạo file**:
    *   **Đối với PDF**: Server/Client render giao diện báo cáo dạng in ấn và xuất thành tệp PDF chất lượng cao.
    *   **Đối với Markdown**: Đóng gói nội dung dạng file văn bản thô `.md`.
4.  **Tải xuống**: Trả tệp tin về trình duyệt để người dùng tải xuống máy cá nhân.

## 4. Ngoại lệ & Thay thế (Alternative Flows)
*   **Phiên xác minh chưa hoàn tất**: Nếu phiên xác minh đang ở trạng thái `queued` hoặc `processing`, tính năng xuất báo cáo sẽ bị khóa trên giao diện để tránh xuất dữ liệu rỗng.

## 5. Ràng buộc MVP
*   Ở phiên bản MVP, ưu tiên xuất file dưới dạng **Markdown (.md)** trực tiếp từ client-side để tiết kiệm tài nguyên server, hoặc sử dụng tính năng in ấn trình duyệt (`window.print()`) được thiết kế riêng CSS print layout cho bản PDF.
