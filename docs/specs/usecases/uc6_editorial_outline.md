# UC6: Tạo đề cương bài viết gợi ý (Editorial Outline)

## 1. Tóm tắt
Tự động đề xuất các góc tiếp cận báo chí an toàn (Story Angles) và xây dựng dàn ý bài viết (Article Outline) định hướng dư luận dựa trên kết quả kiểm chứng và báo cáo rủi ro.

## 2. Actors
*   **Hệ thống (Editorial Engine - LLM)**.

## 3. Luồng xử lý chính (Basic Flow)
1.  **Thu thập dữ liệu đầu vào**: Engine thu thập thông tin của phiên xác minh hiện tại bao gồm:
    *   Nội dung Claims.
    *   Phán quyết xác minh và dẫn chứng nguồn.
    *   Báo cáo rủi ro (Risk Report).
2.  **Chạy Prompt sinh Outline**:
    *   Sử dụng Prompt thiết kế riêng cho biên soạn báo chí để sinh nội dung.
    *   Prompt yêu cầu mô hình LLM viết theo ngôn phong chuyên nghiệp, trung lập và hướng giải quyết vấn đề (đính chính tin đồn hoặc đưa tin chính thống an toàn).
3.  **Ràng buộc Grounding chặt chẽ**:
    *   LLM chỉ được viết dựa vào thông tin có thật từ tập chứng cứ đã xác minh.
    *   Không được tự ý thêm thắt các tình tiết chưa được xác thực bên ngoài.
    *   Yêu cầu bắt buộc trích dẫn các tài liệu đối chứng theo định dạng markdown `[Nguồn 1]`, `[Nguồn 2]` tương ứng với link URL cụ thể.
4.  **Lưu kết quả**: Lưu trữ chuỗi Markdown của dàn ý bài viết vào trường `outline_md` của bảng `verifications`.

## 4. Ngoại lệ & Thay thế (Alternative Flows)
*   **Dữ liệu chưa xác minh (Unverified)**:
    *   Nếu tin tức ở trạng thái chưa thể xác minh rõ đúng sai, Editorial Engine sẽ sinh ra một dàn ý hướng dẫn phóng viên đi điều tra thêm thực tế, chỉ ra các điểm nghi vấn và danh sách các cơ quan/cá nhân cần liên hệ phỏng vấn để làm rõ thông tin.

## 5. Ràng buộc MVP
*   Bản dàn ý sinh ra phải có ít nhất 2 góc tiếp cận (Story Angles) khác nhau để BTV lựa chọn.
*   Outline Markdown phải hiển thị trực quan và có nút "Copy Đề Cương" nhanh trên Frontend.
