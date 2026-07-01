# UC10: Quản lý Persona & Phân quyền Tác nghiệp (Authorization & Role-based Access)

## 1. Tóm tắt
Phân định rõ quyền truy cập và thao tác trên Dashboard giữa hai nhóm vai trò chính: Biên tập viên (BTV) chịu trách nhiệm gửi tin và làm việc với outline, và Người duyệt bài (Reviewer) có thẩm quyền phê duyệt hoặc ghi đè kết quả cuối cùng.

## 2. Actors
*   **Biên tập viên (BTV / Reporter)**.
*   **Người duyệt bài (Reviewer / Editor-in-Chief)**.

## 3. Luồng xử lý chính (Basic Flow)
1.  **Đăng nhập & Xác định vai trò**: Người dùng truy cập hệ thống Dashboard. Sau khi xác thực, hệ thống nhận diện Persona của người dùng từ cơ sở dữ liệu (`reporter` hoặc `reviewer`).
2.  **Hiển thị giao diện theo quyền hạn**:
    *   **Đối với BTV (Reporter)**: Giao diện hiển thị tính năng Tạo xác minh (UC2), Hỏi đáp SmartBot (UC7), và Đọc đề cương/sao chép đề cương (UC6). Nút hiệu chỉnh kết quả (UC8) sẽ bị ẩn hoặc vô hiệu hóa.
    *   **Đối với Người duyệt bài (Reviewer)**: Giao diện hiển thị tất cả các tính năng của BTV, đồng thời mở khóa tính năng Hiệu chỉnh phán quyết và thay đổi mức độ rủi ro (UC8) kèm theo nút "Phê duyệt Xuất bản".
3.  **Kiểm tra phân quyền tại API Gateway**: Mọi yêu cầu ghi đè trạng thái gửi lên `POST /api/verifications/{verification_id}/feedback` đều được API Gateway xác thực JWT và kiểm tra xem người dùng có vai trò `reviewer` hay không trước khi ghi nhận vào PostgreSQL.

## 4. Ngoại lệ & Thay thế (Alternative Flows)
*   **Truy cập trái phép (Unauthorized Access)**:
    *   Nếu một tài khoản BTV cố gắng gửi request hiệu chỉnh trực tiếp lên API, Gateway từ chối xử lý và trả về lỗi `403 Forbidden`.

## 5. Ràng buộc MVP
*   Phân quyền ở mức đơn giản dựa trên Claim trong JWT token.
*   Không yêu cầu hệ thống quản lý phân quyền (RBAC) phức tạp nhiều tầng; chỉ tập trung phân định rõ ràng 2 persona phục vụ kịch bản demo sản phẩm.
