# UC1: Tự động thu thập tin nóng (Trend Ingestion)

## 1. Tóm tắt
Hệ thống tự động lắng nghe và quét thông tin từ không gian mạng định kỳ thông qua API của VNPT vnSocial để phát hiện các chủ đề nóng có tranh cãi và đẩy chúng vào hàng đợi xác minh của HypeRoom.

## 2. Actors
*   **Hệ thống (Cronjob / Worker)**: Tác nhân kích hoạt chính.
*   **VNPT vnSocial API**: Nhà cung cấp nguồn dữ liệu.

## 3. Luồng xử lý chính (Basic Flow)
1.  **Trigger**: Hệ thống Scheduler kích hoạt tác vụ Cronjob định kỳ (ví dụ: mỗi 30 phút).
2.  **Quét tin nóng**: Hệ thống thực hiện yêu cầu HTTP GET đến `GET /api/social/trending` (mocking vnSocial trending).
3.  **Lọc độ tranh cãi**: Duyệt qua danh sách chủ đề trả về. Lọc và chọn các topic thỏa mãn điều kiện:
    $$\text{controversy\_score} \ge 0.7$$
4.  **Tạo bản ghi hàng đợi**: Với mỗi chủ đề tranh cãi được chọn, hệ thống tự động gọi API nội bộ `POST /api/social/trending/{external_ref}/verifications` để khởi động pipeline xác thực bất đồng bộ.
5.  **Ghi log trạng thái**: Lưu log tác vụ thu thập tin nóng vào PostgreSQL để phục vụ audit.

## 4. Ngoại lệ & Thay thế (Alternative Flows)
*   **Không có tin nóng**: Nếu không có chủ đề nào thỏa mãn điều kiện `controversy_score >= 0.7`, hệ thống ghi log "No high controversy trends found" và kết thúc tác vụ.
*   **vnSocial API lỗi (Timeout/Down)**: 
    *   Hệ thống tự động kích hoạt **Mock Mode** (nếu cấu hình `MOCK_MODE=true`) để lấy danh sách topic giả lập chuẩn bị sẵn, đảm bảo luồng demo hoặc hệ thống không bị đứt gãy.
    *   Trạng thái pipeline được đánh dấu là `warning` để cảnh báo quản trị viên.

## 5. Ràng buộc MVP
*   Phải có cấu hình `MOCK_MODE` để demo offline hoặc fallback dữ liệu tĩnh.
*   Độ trễ khi quét tin trending phải ngắn (< 5 giây).
