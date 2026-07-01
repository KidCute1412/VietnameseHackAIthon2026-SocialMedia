# UC2: Chủ động gửi yêu cầu xác minh (Manual Ingestion)

## 1. Tóm tắt
Biên tập viên chủ động nhập nội dung văn bản hoặc tải lên các tập tin nghiệp vụ (ảnh chụp công văn, file ghi âm phỏng vấn, báo cáo PDF) lên Dashboard để bắt đầu luồng xác thực thông tin.

## 2. Actors
*   **Biên tập viên (BTV)**: Tác nhân chính thực hiện thao tác.
*   **VNPT SmartReader OCR**: Dịch vụ số hóa hình ảnh/PDF.
*   **VNPT SmartVoice STT**: Dịch vụ chuyển đổi âm thanh sang văn bản.

## 3. Luồng xử lý chính (Basic Flow)
1.  **Nhập liệu**: BTV truy cập Dashboard, chọn hình thức xác minh:
    *   **Nhập Text**: Nhập tiêu đề và nội dung văn bản.
    *   **Upload Tệp**: Kéo thả ảnh (PNG/JPG), tài liệu (PDF) hoặc tệp ghi âm (WAV/MP3).
2.  **Gửi yêu cầu**: Nhấn nút "Gửi xác minh". Giao diện gọi API `POST /api/verifications` (dưới dạng JSON cho text hoặc Multipart Form cho tệp).
3.  **Xác thực tệp đầu vào**: API Gateway kiểm tra định dạng và dung lượng file hợp lệ.
4.  **Phản hồi nhanh**: API Gateway tạo bản ghi tác vụ với trạng thái `queued` và trả về mã `202 Accepted` cùng `verification_id` ngay lập tức.
5.  **Số hóa ngầm (Asynchronous Workers)**:
    *   **Nếu đầu vào là hình ảnh/PDF**: Worker gửi file đến **VNPT SmartReader OCR** để nhận văn bản tiếng Việt dạng cấu trúc.
    *   **Nếu đầu vào là âm thanh**: Worker gửi file đến **VNPT SmartVoice STT** để nhận chuỗi text dịch từ audio.
6.  **Đưa vào Core Pipeline**: Chuyển text thô đã số hóa qua bước tiếp theo (Trích xuất Claims - UC3).

## 4. Ngoại lệ & Thay thế (Alternative Flows)
*   **Tệp quá kích thước (File too large)**: Trả về lỗi `413 Payload Too Large` kèm thông báo hướng dẫn.
*   **Không đúng định dạng (Unsupported format)**: Trả về lỗi `415 Unsupported Media Type`.
*   **API VNPT lỗi**: Nếu dịch vụ SmartReader/SmartVoice mất kết nối hoặc trả về lỗi, worker sẽ đánh dấu trạng thái task là `failed` hoặc chuyển sang mock adapter nếu `MOCK_MODE=true` để phục vụ demo.

## 5. Ràng buộc MVP
*   Giới hạn dung lượng: Hình ảnh/PDF < 10MB, File âm thanh < 20MB.
*   Thời gian số hóa qua OCR/STT phải được quản lý bất đồng bộ qua Redis Queue để không gây timeout HTTP Request chính.
