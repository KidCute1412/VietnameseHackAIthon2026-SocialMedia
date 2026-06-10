## **1. Executive Summary**

## **Tầm nhìn**

HypeRoom là nền tảng AI hỗ trợ toàn bộ vòng đời sản xuất tin tức cho các cơ quan báo chí, truyền thông và truyền hình.

Khác với các công cụ AI tạo nội dung hiện nay, sản phẩm không tập trung vào việc "viết bài bằng AI" mà tập trung vào bài toán vận hành của newsroom.

## **Định vị:**

AI Copilot cho toàn bộ quy trình phát hiện, xác minh và ra quyết định biên tập.

## **Mục tiêu:**

- Giảm thời gian phát hiện tin tức
- Giảm thời gian xác minh
- Giảm rủi ro xuất bản sai
- Tăng tốc độ phản ứng với sự kiện
- Chuẩn hóa quy trình tác nghiệp

## **2. Bối Cảnh Thị Trường**

## **Thực trạng hiện nay**

Trong 10 năm trước:

- Tin tức xuất phát chủ yếu từ báo chí
- Tốc độ lan truyền chậm
- Quy trình xác minh có nhiều thời gian

Hiện nay:

- Facebook
- TikTok
- Threads
- YouTube KOL
- Livestream
  đã trở thành nguồn phát sinh thông tin chính.

Newsroom phải cạnh tranh về tốc độ.

Áp lực:

- phát hiện nhanh
- kiểm chứng nhanh, xuất bản nhanh
  trong khi vẫn phải đảm bảo độ chính xác.

## **3. Pain Point Cần Giải Quyết**

## **Pain Point 1: Quá tải thông tin**

Mỗi ngày có hàng nghìn tín hiệu:

- bài đăng mạng xã hội
- video viral, hashtag, thông cáo báo chí, văn bản nhà nước

Editor không thể đọc hết.

Kết quả:

- bỏ lỡ cơ hội tin tức
- phản ứng chậm hơn đối thủ

## **Pain Point 2: Xác minh thủ công**

Quy trình hiện tại:

1. đọc tin
2. tìm nguồn
3. tìm văn bản gốc
4. đối chiếu nhiều nguồn
5. gọi điện xác nhận

Mất: 20–40 phút cho mỗi tin.

## **Pain Point 3: Áp lực xuất bản nhanh**

Nếu xác minh quá kỹ: chậm
Nếu đăng quá nhanh: sai
Newsroom luôn phải đánh đổi giữa: Speed vs Accuracy

## **Pain Point 4: Thiếu Audit Trail**

Sau khi xuất bản, khó trả lời:

- nguồn nào được dùng?
- ai phê duyệt?
- bằng chứng nào được sử dụng?
- lý do quyết định xuất bản?

## **Pain Point 5: Không có hệ thống hỗ trợ quyết định biên tập**

AI hiện nay hỗ trợ:

- viết bài
- tóm tắt

Nhưng chưa hỗ trợ:

- nên đăng hay không?
- mức độ rủi ro
- góc khai thác nào phù hợp

Đây là khoảng trống thị trường.

## **4. Khách Hàng Mục Tiêu**

## **Nhóm khách hàng chính**

### **Báo điện tử**

Ví dụ: VnExpress, Dân Trí, Tuổi Trẻ, Thanh Niên
Pain:

- cần đăng nhanh
- nhiều editor

### **Đài truyền hình**

Pain:

- xử lý nhiều nguồn tin
- nhiều cuộc phỏng vấn
- nhiều tài liệu

### **Tòa soạn địa phương**

Pain:

- thiếu nhân sự
- cần tăng năng suất

## **Nhóm khách hàng mở rộng**

### **Agency truyền thông**

Theo dõi:

- xu hướng
- dư luận
- sự kiện
- thương hiệu
- khủng hoảng truyền thông

### **Doanh nghiệp lớn**

Theo dõi thương hiệu, khủng hoảng truyền thông.

### **Cơ quan nhà nước**

Theo dõi:

- phản hồi xã hội
- thông tin sai lệch

## **5. Giá Trị Cốt Lõi**

### **Hiện trạng**

| **Công việc**  | **Thời gian** |
| -------------- | ------------- |
| Theo dõi trend | 30 phút       |
| Xác minh       | 20-40 phút    |
| Đọc tài liệu   | 15 phút       |
| Tạo outline    | 10 phút       |

### **Sau AI**

| **Công việc**  | **Thời gian** |
| -------------- | ------------- |
| Theo dõi trend | 30 giây       |
| Xác minh       | 2-3 phút      |
| Đọc tài liệu   | 30 giây       |
| Tạo outline    | 30 giây       |

Mục tiêu:

- giảm 80–90% thời gian xử lý
- tăng tốc độ xuất bản
- giảm rủi ro sai sót

## **6. Mô Hình Doanh Thu**

### **SaaS Subscription**

**Starter**: 5 triệu VNĐ/tháng (Khách hàng: newsroom nhỏ)
**Professional**: 15 triệu VNĐ/tháng (Khách hàng: newsroom vừa)
**Enterprise**: 50 triệu+ VNĐ/tháng (Khách hàng: tập đoàn truyền thông, đài truyền hình)

### **Dịch vụ triển khai**

Thu phí: setup, đào tạo, tích hợp.

### **API Usage**

Thu phí theo: số request, số người dùng, số newsroom.

## **7. Workflow Hệ Thống**

Hệ thống hỗ trợ 2 luồng đầu vào (input workflows) song song trước khi đi vào pipeline kiểm chứng và hỗ trợ biên tập chung:

### **Luồng 1: vnSocial Trend Ingestion & Filtering (Tự động)**

- **Mục tiêu**: Tự động phát hiện tín hiệu mới từ mạng xã hội.
- **Input**: Dữ liệu mạng xã hội từ vnSocial\.
- **Cơ chế lọc nhiễu**: Hệ thống tự động phân loại và loại bỏ toàn bộ dữ liệu, văn bản liên quan đến **hành chính công** để tránh nhiễu thông tin thủ tục hành chính, tập trung vào tin tức nóng và dư luận xã hội.
- **Output**: Danh sách các chủ đề đang nổi đã được lọc sạch.

### **Luồng 2: User Document Verification Workflow (Người dùng chủ động)**

- **Mục tiêu**: Kiểm chứng và khai thác tài liệu do người dùng tải lên (thông cáo báo chí, công văn, tài liệu rò rỉ, bản thảo thảo luận...).
- **Input**: File văn bản do người biên tập tải lên trực tiếp (PDF, DOCX, TXT, ảnh chụp công văn...).
- **Xử lý tài liệu**: Sử dụng **SmartReader** để thực hiện OCR, trích xuất văn bản và tóm tắt nhanh nội dung tài liệu.
- **Output**: Nội dung văn bản được chuẩn hóa để chuyển vào Verification Engine.

---

## **Pipeline Xử Lý & Xác Minh**

### **Step 1: Signal Ranking (Chỉ áp dụng cho Luồng 1 - vnSocial)**

- **AI đánh giá**: mức độ tăng trưởng, độ lan truyền, độ tranh cãi.
- **Output**: opportunity score, initial risk score.

### **Step 2: Claim Extraction (Áp dụng cho cả 2 luồng)**

- **LLM trích xuất**: các tuyên bố cần xác minh từ chủ đề hot hoặc từ văn bản người dùng upload.
- **Ví dụ**: "Bộ Giáo dục bỏ kỳ thi tốt nghiệp".
- **Output**: Claim Object (Tuyên bố, Thực thể liên quan, Thời gian).

### **Step 3: Evidence Collection**

- **Thu thập**: báo chí chính thống, văn bản pháp luật, thông cáo, website chính thức.
- **Output**: Evidence Pool.

### **Step 4: Document Intelligence**

- **Sử dụng**: SmartReader để OCR, trích xuất thông tin chi tiết và tóm tắt các tài liệu trong Evidence Pool.
- **Output**: Evidence Pack.

### **Step 5: Verification Engine**

- **Đối chiếu**: Claim vs Evidence.
- **Output**: Supported / Contradicted / Uncertain.

### **Step 6: Risk Assessment & Verification Report**

- **Mục tiêu**: Cảnh báo sớm cho biên tập viên trước khi bắt đầu lập đề cương bài viết.
- **AI sinh**:
  - **Risk Report**: Phân tích rủi ro pháp lý, chính sách, độ nhạy cảm chính trị và xung đột thông tin.
  - **Verification Report**: Báo cáo độ chính xác của nguồn tin và độ tin cậy của chứng cứ.
- **Quy trình**: Biên tập viên xem xét báo cáo rủi ro để đưa ra quyết định có tiếp tục triển khai đề tài này hay không.

### **Step 7: Editorial Intelligence**

- **Mục tiêu**: Hỗ trợ định hình bài viết dựa trên kết quả xác minh và định hướng giảm thiểu rủi ro từ Risk Report.
- **AI sinh**:
  - **Story Angle**: Các góc tiếp cận thông tin an toàn, khách quan và hấp dẫn.
  - **Outline**: Đề cương chi tiết bài viết (đã tích hợp các khuyến nghị giảm thiểu rủi ro từ Risk Report).

### **Step 8: Audit Trail**

- **Lưu**: nguồn dùng, nguồn loại, báo cáo rủi ro đã duyệt, quyết định biên tập của con người.

## **8. Tận Dụng API BTC**

### **vnSocial**

Vai trò: Trend Intelligence Engine
Sử dụng: trending topic, sentiment analysis
Giá trị: Đây là nguồn dữ liệu đầu vào quan trọng nhất.

### **SmartVoice**

Vai trò: Interview Intelligence
Sử dụng: speech to text, call summary
Giá trị: Tự động tóm tắt phỏng vấn.

### **SmartReader**

Vai trò: Document Intelligence & Input Verification
Sử dụng: OCR, structured content extraction, summarization.
Giá trị:

1. Đọc và số hóa các công văn, PDF, thông cáo báo chí tìm thấy trong Evidence Pool để phục vụ quá trình đối chiếu.
2. Đóng vai trò là cổng vào (gateway) chính của luồng "User Document Verification Workflow", giúp số hóa nhanh chóng các văn bản, ảnh chụp tài liệu do người dùng tải lên để phục vụ xác minh.

### **SmartBot**

Vai trò: Verification Copilot
Sử dụng: QA reasoning, report generation
