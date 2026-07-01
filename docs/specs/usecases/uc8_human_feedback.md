# UC8: Phản hồi hiệu chỉnh kết quả (Human Feedback)

## 1. Tóm tắt
Đảm bảo cơ chế Human-in-the-Loop bằng cách cho phép Biên tập viên ghi đè, điều chỉnh các phán quyết tự động hoặc mức độ rủi ro do AI đánh giá và ghi nhận lại nhật ký phục vụ công tác hậu kiểm.

## 2. Actors
*   **Biên tập viên (BTV)**.
*   **Hệ thống (Audit Database Layer)**.

## 3. Luồng xử lý chính (Basic Flow)
1.  **Yêu cầu hiệu chỉnh**: BTV phát hiện kết quả AI đánh giá chưa chuẩn xác (ví dụ: Tin giả nhưng AI đánh giá là chưa xác minh, hoặc mức rủi ro cần nâng từ `medium` lên `high`).
2.  **Thao tác ghi đè**: BTV click nút "Hiệu chỉnh" trên giao diện Dashboard, chọn thông số mới và nhập lý do hiệu chỉnh.
3.  **Gửi yêu cầu**: Client gửi request `POST /api/verifications/{verification_id}/feedback` chứa:
    ```json
    {
      "event_type": "risk_override",
      "claim_id": null,
      "before_state": { "risk_level": "medium" },
      "after_state": { "risk_level": "high" },
      "reason": "Ý kiến từ ban biên tập cần nâng mức cảnh báo"
    }
    ```
4.  **Cập nhật dữ liệu hiện hành**:
    *   Hệ thống cập nhật trực tiếp trường `risk_level` trong bảng `verifications` thành `high` để giao diện phản ánh thay đổi ngay lập tức.
5.  **Append Audit Log**:
    *   Hệ thống lưu trữ lịch sử hiệu chỉnh vào bảng `feedback_events` trong PostgreSQL.
6.  **Phản hồi thành công**: Trả về HTTP Status `201 Created` cùng mã `feedback_id`.

## 4. Ngoại lệ & Thay thế (Alternative Flows)
*   **Lý do hiệu chỉnh quá ngắn**:
    *   Nếu BTV không nhập lý do hoặc lý do ít hơn 5 ký tự, Frontend ngăn chặn thao tác và nhắc nhở BTV giải trình để lưu trữ lịch sử chất lượng.

## 5. Ràng buộc MVP
*   Không được xóa bỏ kết quả phân tích AI ban đầu. Phải lưu cả trạng thái trước (`before_state`) và sau (`after_state`) để phục vụ đối chiếu và tinh chỉnh prompt sau này.
*   Khi BTV/Reviewer thay đổi phán quyết hoặc mức rủi ro, hệ thống **không** tự động kích hoạt tạo lại đề cương gợi ý (UC6) để tối ưu chi phí token LLM. Việc tạo lại đề cương chỉ diễn ra khi người dùng chủ động nhấn nút "Tạo lại đề cương" trên Dashboard UI.
