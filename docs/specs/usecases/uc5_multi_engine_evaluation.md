# UC5: Đánh giá Trust - Impact - Risk (Multi-Engine Evaluation)

## 1. Tóm tắt
Đánh giá đa chiều về mức độ trung thực của thông tin, quy mô thảo luận và mức độ rủi ro pháp lý/truyền thông của tin tức phục vụ công tác duyệt xuất bản.

## 2. Actors
*   **Hệ thống (Evaluation Engines)**.
*   **VNPT vnSocial API**: Cung cấp chỉ số đo lường thảo luận dư luận.
*   **SmartBot LLM Engine**: Xử lý logic phán quyết và luật rủi ro.

## 3. Luồng xử lý chính (Basic Flow)
1.  **Đánh giá Độ tin cậy (Trust Engine)**:
    *   Đối chiếu claim với tập chứng cứ thu được bằng LLM.
    *   Xác định phán quyết (`verdict`): `supported` (Đúng), `contradicted` (Sai / Tin giả), hoặc `unverified` (Chưa xác minh).
    *   Tính điểm **Trust Score (0-100)** theo công thức heuristic:
        $$\text{Trust Score} = w_{\text{source}} \times \text{Semantic Alignment Score}$$
        *(Trọng số nguồn $w$: Chính phủ/Cổng TTĐT = 1.0; Báo lớn = 0.8; Blog/MXH = 0.3).*
2.  **Đánh giá Ảnh hưởng dư luận (Impact Engine)**:
    *   Gọi **VNPT vnSocial API** truy vấn tần suất thảo luận của các từ khóa liên quan đến thực thể.
    *   Tính toán **Impact Score (0-100)** dựa trên tốc độ lan truyền (Mention Velocity Index) và tỷ lệ cảm xúc tiêu cực (`sentiment_neg_ratio`).
3.  **Đánh giá Rủi ro xuất bản (Risk Engine)**:
    *   LLM nhận claims, Trust Score, Impact Score và bộ cẩm nang chính sách Luật Báo chí Việt Nam.
    *   Xác định **Risk Level** (`low`, `medium`, `high`).
    *   Sinh báo cáo phân tích rủi ro định dạng Markdown (`risk_report_md`).
4.  **Lưu kết quả**: Cập nhật các trường dữ liệu điểm số, phán quyết và báo cáo rủi ro vào PostgreSQL cho bản ghi `verifications`.

## 4. Ngoại lệ & Thay thế (Alternative Flows)
*   **Không có dữ liệu dư luận trên vnSocial**:
    *   Impact Engine đặt mặc định `sentiment_metrics` ở trạng thái trung tính và `impact_score = 0`.
    *   Hệ thống vẫn tiếp tục chạy Trust và Risk Engine bình thường.
*   **Trọng số nguồn không xác định**:
    *   Nếu nguồn chứng cứ mới nằm ngoài danh sách định nghĩa sẵn, hệ thống áp dụng trọng số mặc định $w = 0.5$.

## 5. Ràng buộc MVP
*   Mọi phán quyết của Trust Engine bắt buộc phải đưa ra lập luận (Rationales) chi tiết dẫn chứng từ chứng cứ nào.
*   Risk Engine phải dán nhãn `high` ngay lập tức cho các tin giả (`contradicted`) có chỉ số ảnh hưởng lớn (`impact_score > 70`).
