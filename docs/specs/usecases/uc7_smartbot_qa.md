# UC7: Hỏi đáp tác nghiệp thời gian thực (SmartBot Q&A)

## 1. Tóm tắt
Biên tập viên tương tác trực tiếp bằng ngôn ngữ tự nhiên thông qua giao diện chat để hỏi đáp sâu về chứng cứ hoặc yêu cầu điều chỉnh lại đề cương/dàn ý bài viết.

## 2. Actors
*   **Biên tập viên (BTV)**.
*   **Hệ thống (SmartBot WebSocket Server)**.

## 3. Luồng xử lý chính (Basic Flow)
1.  **Thiết lập kết nối**: Khi BTV truy cập trang chi tiết xác minh, Client thiết lập kết nối WebSocket đến server tại địa chỉ:
    `GET /api/ws/smartbot?verification_id={uuid}`
2.  **Gửi câu hỏi**: BTV nhập nội dung hỏi đáp (ví dụ: "Hãy tổng hợp lại các nguồn chứng cứ bác bỏ tin đồn này") và gửi message dạng JSON:
    ```json
    {
      "type": "user_prompt",
      "message_id": "uuid",
      "verification_id": "uuid",
      "prompt": "Tom tat bang chung chinh"
    }
    ```
3.  **Xác nhận tin nhắn (ACK)**: Server gửi lại phản hồi ACK lập tức để xác nhận đã nhận câu hỏi:
    ```json
    {
      "type": "ack",
      "message_id": "uuid"
    }
    ```
4.  **Truy vấn & Trả lời**:
    *   Hệ thống lấy toàn bộ context chứng cứ của phiên xác minh hiện tại làm dữ liệu nền (Grounding Context).
    *   LLM sinh câu trả lời giải đáp thắc mắc của BTV.
5.  **Gửi câu trả lời**: Server phản hồi qua WebSocket với cấu trúc chứa citations:
    ```json
    {
      "type": "answer",
      "answer_id": "uuid",
      "message_id": "uuid",
      "content": "Lời giải đáp của trợ lý...",
      "citations": [
        {
          "evidence_id": "uuid",
          "title": "Tên bài báo nguồn",
          "url": "https://chinhphu.vn/..."
        }
      ]
    }
    ```

## 4. Ngoại lệ & Thay thế (Alternative Flows)
*   **Hỏi đáp ngoài phạm vi (Out of Scope)**:
    *   Nếu BTV hỏi những chủ đề không liên quan đến phiên xác minh hiện tại, SmartBot sẽ phản hồi lịch sự: "Tôi chỉ có thể giải đáp các vấn đề xoay quanh tài liệu/chủ đề xác minh hiện tại. Xin vui lòng tập trung vào ngữ cảnh tài liệu."
*   **Lỗi kết nối WebSocket đứt quãng**:
    *   Client tự động bắt đầu cơ chế kết nối lại (auto-reconnect) sau 3 giây và duy trì trạng thái hội thoại.

## 5. Ràng buộc MVP
*   Mọi câu trả lời của trợ lý liên quan đến facts bắt buộc phải đính kèm ít nhất 1 citation trích dẫn chứng cứ cụ thể.
*   Chưa yêu cầu streaming token trong MVP; trả về toàn bộ chuỗi văn bản hoàn chỉnh để tối giản hóa thiết kế transport.
