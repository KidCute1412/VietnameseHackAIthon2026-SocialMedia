# UC3: Trích xuất Claims & Thực thể (Claim Extraction)

## 1. Tóm tắt
Phân tích văn bản thô đã được số hóa từ các nguồn tiếp nhận để bóc tách ra các thực thể chính (người, tổ chức, địa điểm) và các tuyên bố mang tính khẳng định (claims) cần được kiểm chứng.

## 2. Actors
*   **Hệ thống (SmartBot LLM Engine)**.

## 3. Luồng xử lý chính (Basic Flow)
1.  **Nhận text thô**: Worker nhận văn bản đầu vào từ bước số hóa hoặc text nhập tay trực tiếp.
2.  **Gọi LLM trích xuất**: Hệ thống xây dựng prompt RAG/Few-shot đặc thù cho mô hình LLM (nhúng qua VNPT SmartBot hoặc Gemini API).
3.  **Cấu trúc dữ liệu đầu ra**: Yêu cầu mô hình LLM trả về kết quả tuân thủ nghiêm ngặt định dạng JSON Schema:
    ```json
    {
      "claims": [
        {
          "claim_id": "uuid",
          "claim_statement": "Nội dung khẳng định cụ thể...",
          "entity": "Thực thể liên quan (ví dụ: Bộ Tài Chính)",
          "category": "Lĩnh vực (Kinh tế / Chính trị / Xã hội...)"
        }
      ]
    }
    ```
4.  **Lưu trữ**: Lưu toàn bộ các đối tượng claim đã bóc tách vào cơ sở dữ liệu PostgreSQL gắn với khóa ngoại `verification_id`.

## 4. Ngoại lệ & Thay thế (Alternative Flows)
*   **Văn bản không chứa claim nào cần xác minh**:
    *   LLM trả về mảng `claims` rỗng.
    *   Hệ thống tự động cập nhật trạng thái của phiên xác minh thành `verified` với `verdict = unverified` (Chưa được xác minh do không có claim) và kết thúc pipeline sớm.
*   **Lỗi phân tích cú pháp JSON (JSON Parse Error)**:
    *   Nếu LLM trả về cấu trúc lỗi, hệ thống sẽ thực hiện thử lại (retry) tối đa 2 lần với nhiệt độ (temperature) thấp hơn hoặc sử dụng chế độ parse thô dự phòng.

## 5. Ràng buộc MVP
*   Mỗi văn bản không được trích xuất quá 5 claims chính để tránh quá tải cho khâu truy xuất chứng cứ trực tuyến (Tavily).
*   Mọi claim bắt buộc phải có thực thể chủ quản (`entity`) đi kèm.
