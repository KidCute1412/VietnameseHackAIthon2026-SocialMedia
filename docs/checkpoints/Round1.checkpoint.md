# CHECKLIST ĐÁNH GIÁ PROPOSAL VÒNG 1 - BẢNG B (CHALLENGER)
## Dự án: AI News Intelligence OS (AI-Powered Newsroom Intelligence)

Tài liệu này cung cấp bộ tiêu chí kiểm định (checkpoint) chi tiết, bám sát barem điểm 100 của Ban tổ chức cuộc thi **Vietnamese Student HackAIthon 2026 - Bảng B (Challenger)**. Mục tiêu giúp đội ngũ tự rà soát, nâng cấp tài liệu đề xuất (Proposal PDF) đạt mức độ tối ưu nhất để cạnh tranh vào Top 20 Vòng 2.

---

## I. CẤU TRÚC BẮT BUỘC CỦA HỒ SƠ DỰ THI
Hồ sơ nộp dưới dạng **file .pdf** (xuất từ Word hoặc PowerPoint) và phải chứa đầy đủ các phần sau:
*   [ ] **Tên sản phẩm, dự án:** Rõ ràng, ấn tượng, phản ánh đúng giải pháp.
*   [ ] **Thông tin đội thi:** Tên đội, thông tin cá nhân các thành viên (Họ tên, trường học, MSSV, vai trò trong đội, số điện thoại, email liên hệ, thông tin người hướng dẫn nếu có).
*   [ ] **Đặt vấn đề và cách giải quyết (Pain points & Solution):** Nêu thực trạng, nỗi đau và giải pháp tương ứng.
*   [ ] **Thiết kế tổng quan (System Architecture & UI/UX):** Sơ đồ kỹ thuật, sơ đồ luồng dữ liệu, wireframe.
*   [ ] **Phương hướng triển khai (Implementation Plan):** Công nghệ, lộ trình phát triển, dự toán chi phí, an toàn bảo mật, lộ trình GTM.
*   [ ] **Video thuyết minh (Khuyến khích):** Link video Youtube/Drive (thời lượng khuyến nghị 3-5 phút, giới thiệu tổng quan ý tưởng và demo/wireframe nếu có).

---

## II. CHECKLIST CHI TIẾT THEO TIÊU CHÍ CHẤM ĐIỂM (100 ĐIỂM)

### Tiêu chí 1: Tính Phù Hợp Đề Bài (Tối đa: 25 điểm)
Tiêu chí này đánh giá mức độ giải quyết bài toán thực tế và tính hợp lý khi áp dụng AI.

| Hạng mục rà soát | Mức độ: Sơ sài (0 - 10đ) | Mức độ: Đạt yêu cầu (11 - 20đ) | Mức độ: Xuất sắc / WOW (21 - 25đ) |
| :--- | :--- | :--- | :--- |
| **1.1. Bám sát đề tài số 2** *(Nâng cao hiệu quả vận hành của cơ quan truyền thông, báo chí, truyền hình)* | Chỉ đề cập chung chung là ứng dụng AI hỗ trợ báo chí viết bài hoặc dịch bài. | Nêu được hệ thống giúp editor tìm kiếm thông tin và phát hiện tin tức nhanh hơn bằng AI. | Định vị rõ hệ thống là **Newsroom Intelligence OS** - tích hợp toàn diện từ giám sát xu hướng (Trend Monitoring), trích xuất tuyên bố (Claim Extraction), xác minh bằng chứng (Evidence Verification) đến hỗ trợ ra quyết định biên tập và lưu nhật ký bằng chứng (Audit Trail). |
| **1.2. Phân tích Pain-point & Số liệu thực tế** | Chỉ nêu lý thuyết: "Báo chí cần đưa tin nhanh", "Tin giả nhiều". Không có số liệu. | Có số liệu chung chung về lượng tin giả trên internet. Chỉ ra editor mất nhiều thời gian đọc nguồn tin. | **Chứng minh bằng số liệu thực tế tại Việt Nam:**<br>- Trích dẫn số lượng tòa soạn hiện nay (~800 cơ quan báo chí, ~100 đài truyền hình).<br>- Định lượng thời gian xác minh thủ công của 1 editor đối với 1 tin nóng (20 - 40 phút).<br>- Chỉ rõ bài toán đánh đổi giữa Tốc độ xuất bản (Speed) và Độ chính xác (Accuracy). |
| **1.3. Lý do "Vì sao dùng AI?" (Why AI)** | Viết rằng "Sử dụng AI cho hiện đại" hoặc "Dùng AI để tự động hóa". | Giải thích được AI giúp dịch bài hoặc tóm tắt nhanh hơn tìm kiếm bằng Google thông thường. | **Chứng minh AI là bắt buộc vì:**<br>- Xử lý ngôn ngữ tự nhiên (NLP) để trích xuất thực thể và nội dung cốt lõi (Claim Extraction) từ hàng nghìn nguồn dữ liệu hỗn tạp.<br>- Sử dụng mô hình NLI (Natural Language Inference) để đối chiếu logic giữa Claim và Evidence mà công cụ tìm kiếm truyền thống không làm được.<br>- Ứng dụng mô hình suy luận (Reasoning) để đưa ra đề xuất biên tập và chấm điểm độ tin cậy (Trust Score). |

---

### Tiêu chí 2: Tính Đổi Mới và Khác Biệt (Tối đa: 20 điểm)
Tiêu chí đánh giá tính độc bản, chứng minh sự khác biệt so với các sản phẩm thương mại hoặc mã nguồn mở sẵn có.

| Hạng mục rà soát | Mức độ: Sơ sài (0 - 8đ) | Mức độ: Đạt yêu cầu (9 - 15đ) | Mức độ: Xuất sắc / WOW (16 - 20đ) |
| :--- | :--- | :--- | :--- |
| **2.1. Phân tích đối thủ cạnh tranh** | Không có phần so sánh hoặc chỉ nêu "chưa có sản phẩm nào tương tự trên thị trường". | So sánh chung chung với ChatGPT hoặc Google Search và kết luận hệ thống của mình tốt hơn. | **Lập bảng so sánh tính năng trực quan (Feature Matrix) với:**<br>1. *ChatGPT/Gemini:* (Chỉ tạo nội dung, dễ bị ảo giác, không có cơ sở dữ liệu thực tế thời gian thực).<br>2. *Perplexity:* (Công cụ tìm kiếm trả lời câu hỏi, không hỗ trợ quy trình vận hành và kiểm duyệt nội dung của tòa soạn).<br>3. *Hệ thống Fact-check truyền thống (Snopes, Factcheck.org):* (Thực hiện thủ công bởi con người, chậm trễ). |
| **2.2. Chứng minh sự khác biệt >= 30%** | Không làm rõ tính năng nào khác biệt ngoài việc giao diện đẹp hơn hoặc dễ dùng hơn. | Chỉ ra hệ thống có tích hợp API của Việt Nam để tối ưu tiếng Việt. | **Chỉ rõ 3 điểm cốt lõi tạo nên sự khác biệt vượt trội (>= 30%):**<br>1. *Newsroom Workflow:* Thiết kế quy trình khép kín tối ưu cho Editor thay vì công cụ hỏi đáp tự do.<br>2. *Decision Support Engine:* Đưa ra bộ chỉ số (Trust Score, Impact Score, Priority Score) hỗ trợ ban biên tập duyệt bài nhanh.<br>3. *Audit Trail:* Lưu trữ toàn bộ lịch sử đối chiếu nguồn tin để làm bằng chứng pháp lý khi cần thiết. |

---

### Tiêu chí 3: Tính Khả Thi (Tối đa: 25 điểm)
Đánh giá khả năng hiện thực hóa ý tưởng thành sản phẩm thực tế, kế hoạch vận hành và pháp lý.

| Hạng mục rà soát | Mức độ: Sơ sài (0 - 10đ) | Mức độ: Đạt yêu cầu (11 - 20đ) | Mức độ: Xuất sắc / WOW (21 - 25đ) |
| :--- | :--- | :--- | :--- |
| **3.1. Dữ liệu & Nhân lực hợp pháp** | Không đề cập nguồn gốc dữ liệu hoặc chỉ ghi "quét trên mạng". Nhân sự không phân chia vai trò rõ ràng. | Liệt kê các nguồn dữ liệu là báo chí công khai. Nhân lực có lập trình viên và người viết tài liệu. | **Chứng minh tính hợp pháp tuyệt đối:**<br>- Sử dụng API chính thức của BTC cung cấp (**vnSocial** để lấy trend, **SmartReader/SmartVoice** để bóc tách thông tin).<br>- Khai thác RSS Feeds công khai của các báo điện tử được cấp phép tại VN.<br>- Đội ngũ phân bổ vai trò rõ ràng: AI/Data Engineer, Backend/API Integration, Frontend/UX Designer, Business/Product Analyst. |
| **3.2. Kiến trúc & Kỹ thuật triển khai** | Chỉ liệt kê tên công nghệ (Python, React, Node.js) mà không có sơ đồ hệ thống. | Có sơ đồ kiến trúc tổng quan nhưng đơn giản, chưa làm rõ luồng dữ liệu xử lý AI. | **Sơ đồ kiến trúc phân lớp chi tiết:**<br>- *Data Layer:* RSS Feed, vnSocial, Document Upload.<br>- *AI Processing Layer:* BGE-M3 (Retrieval), Gemini 2.5 Flash (Extraction, Classification, Verification).<br>- *Backend/API Layer:* FastAPI, Celery (xử lý bất đồng bộ).<br>- *Frontend:* Next.js Dashboard hiển thị thời gian thực. |
| **3.3. Tận dụng Hệ sinh thái API của BTC** | Chỉ sử dụng 1 API duy nhất của BTC và không nêu rõ cách tích hợp. | Sử dụng 2-3 API của BTC nhưng mô tả sơ sài, mang tính chất "liệt kê cho đủ". | **Tích hợp sâu chuỗi API của VNPT/BTC:**<br>- *vnSocial:* Lắng nghe xu hướng, phân tích cảm xúc dư luận để đánh giá **Impact Score**.<br>- *SmartReader (OCR):* Đọc hiểu và trích xuất dữ liệu từ công văn, thông cáo báo chí (.pdf, ảnh chụp).<br>- *SmartVoice (STT):* Chuyển đổi tóm tắt các cuộc phỏng vấn, họp báo, livestream.<br>- *SmartBot:* Đóng vai trò Trợ lý ảo hỗ trợ truy vấn nhanh lịch sử xác minh.<br>- *SmartUX:* Theo dõi và đo lường trải nghiệm tác nghiệp của Editor trên Dashboard. |
| **3.4. Ước tính chi phí hạ tầng & Vận hành** | Không có dự toán chi phí hoặc chỉ ghi "dùng server miễn phí". | Ước tính chi phí server chung chung theo tháng mà không có cơ sở tính toán. | **Bảng dự toán chi phí chi tiết theo đơn vị sử dụng (Unit Economics):**<br>- *Hạ tầng:* VPS/Cloud (AWS/VNG Cloud) chạy API Gateway, Backend, Frontend (~1.5M - 3M VNĐ/tháng).<br>- *AI Inference:* Ước tính số lượng tokens xử lý trên mỗi bài viết/yêu cầu kiểm chứng của 1 tòa soạn nhỏ (ví dụ: $0.005/tin xác minh). |
| **3.5. Pháp lý, An toàn bảo mật tại Việt Nam** | Ghi chung chung "hệ thống bảo mật". | Nêu được việc sử dụng HTTPS và mã hóa mật khẩu người dùng. | **Tuân thủ nghiêm ngặt các quy định pháp luật Việt Nam:**<br>- Đảm bảo an ninh thông tin theo **Luật An ninh mạng 2018**.<br>- Tuân thủ **Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân** (không lưu trữ trái phép thông tin cá nhân của người dùng cuối khi chưa đồng ý).<br>- Giải pháp an toàn dữ liệu: Mã hóa AES-256 cho tài liệu upload, phân quyền người dùng (RBAC - Role-Based Access Control) cho các biên tập viên. |
| **3.6. Lộ trình triển khai & Roadmap GTM** | Không có timeline hoặc chỉ có kế hoạch 2 tuần làm bài thi. | Timeline chia theo tuần để hoàn thành MVP trong cuộc thi. | **Roadmap rõ ràng sau cuộc thi:**<br>- *Giai đoạn 1 (MVP - 2 tuần):* Hoàn thành core pipeline (Thu thập RSS -> Chấm điểm Trust/Impact -> Xuất báo cáo).<br>- *Giai đoạn 2 (Pilot - 2 tháng):* Thử nghiệm thực tế tại 2-3 tòa soạn báo địa phương để lấy phản hồi.<br>- *Giai đoạn 3 (Commercialize - 6 tháng):* Ra mắt thương mại, tích hợp các kênh truyền thông khác. |

---

### Tiêu chí 4: Tác Động Dự Kiến (Tối đa: 20 điểm)
Đánh giá giá trị kinh doanh, lợi ích xã hội và quy mô thị trường mà giải pháp có thể tiếp cận.

| Hạng mục rà soát | Mức độ: Sơ sài (0 - 8đ) | Mức độ: Đạt yêu cầu (9 - 15đ) | Mức độ: Xuất sắc / WOW (16 - 20đ) |
| :--- | :--- | :--- | :--- |
| **4.1. Lợi ích xã hội & Kinh doanh** | Nêu chung chung: "Giúp xã hội tốt đẹp hơn", "Tòa soạn tiết kiệm tiền". | Định lượng được việc tiết kiệm thời gian của biên tập viên (ví dụ: giảm thời gian xác minh từ 30 phút xuống 5 phút). | **Chỉ số đo lường hiệu quả (KPIs) rõ ràng:**<br>- *Vận hành:* Giảm 85% thời gian xử lý và kiểm chứng thông tin của newsroom.<br>- *Kinh doanh:* Tăng 40% sản lượng tin bài xuất bản chất lượng cao, giảm thiểu tối đa rủi ro bị phạt hành chính do đưa tin sai sự thật.<br>- *Xã hội:* Góp phần làm lành mạnh hóa không gian thông tin, hỗ trợ phát hiện sớm tin giả gây hoang mang dư luận. |
| **4.2. Ước tính quy mô thị trường (TAM - SAM - SOM)** | Không có phần này hoặc chỉ đưa ra một con số tiền chung chung không rõ nguồn gốc. | Có định nghĩa TAM, SAM, SOM nhưng áp dụng sai đối tượng hoặc số liệu không thực tế. | **Số liệu TAM - SAM - SOM thuyết phục tại thị trường Việt Nam:**<br>- **TAM (Total Addressable Market):** Toàn bộ thị trường giải pháp phần mềm cho doanh nghiệp truyền thông, agency và bộ phận PR/Marketing tại VN (~10.000 đơn vị).<br>- **SAM (Serviceable Available Market):** ~800 cơ quan báo chí, tạp chí điện tử và ~100 đài truyền hình/phát thanh có giấy phép hoạt động tại VN.<br>- **SOM (Serviceable Obtainable Market):** Mục tiêu chiếm lĩnh 5% thị phần SAM trong 1 năm đầu (khoảng 45 tòa soạn báo điện tử vừa và nhỏ). |
| **4.3. Mô hình doanh thu (Revenue Model)** | Ghi "bán phần mềm lấy tiền" hoặc "chưa tính đến mô hình doanh thu". | Đề xuất bán gói phần mềm theo tháng nhưng mức giá chưa hợp lý hoặc thiếu chi tiết. | **Mô hình SaaS Hybrid thông minh:**<br>- *Starter (5 triệu VNĐ/tháng):* Giới hạn số lượng editor (< 10) và số lượng yêu cầu xác minh hàng tháng. Phù hợp báo chuyên ngành, tạp chí nhỏ.<br>- *Professional (15 triệu VNĐ/tháng):* Dành cho tòa soạn báo điện tử quy mô vừa, mở rộng dung lượng lưu trữ tài liệu.<br>- *Enterprise (Custom):* On-premise hoặc Private Cloud dành cho đài truyền hình lớn, tích hợp sâu vào CMS hiện tại.<br>- *API Billing:* Thu phí dựa trên lượt gọi API (e.g., trích xuất claim, OCR công văn). |

---

### Tiêu chí 5: Chất Lượng Hồ Sơ (Tối đa: 10 điểm)
Đánh giá sự chuyên nghiệp trong cách trình bày, thiết kế trực quan và tính nhất quán của tài liệu.

*   [ ] **Trình bày logic (4 điểm):** Cấu trúc tài liệu mạch lạc, sử dụng các tiêu đề rõ ràng, phân cấp nội dung hợp lý (sử dụng định dạng Markdown/PDF chuyên nghiệp). Có phần mở đầu (Executive Summary) tóm tắt các điểm đắt giá nhất.
*   [ ] **Minh họa trực quan (4 điểm):**
    *   Phải có **Sơ đồ kiến trúc hệ thống (System Architecture)** rõ ràng (khuyến khích vẽ bằng Mermaid hoặc công cụ chuyên nghiệp, tránh vẽ tay cẩu thả).
    *   Phải có **Wireframe/UI Design Mockup** (ví dụ: giao diện Dashboard của Editor, giao diện màn hình chat với SmartBot, màn hình báo cáo phân tích độ tin cậy). Link Figma đi kèm sẽ là điểm cộng lớn.
*   [ ] **Chất lượng ngôn ngữ (2 điểm):** Tuyệt đối không có lỗi chính tả, lỗi font chữ. Văn phong chuyên nghiệp, khách quan, tránh sử dụng biệt ngữ kỹ thuật quá phức tạp mà không giải thích.

---

## III. HƯỚNG DẪN VIẾT CHI TIẾT TỪNG MỤC CHO DỰ ÁN "AI NEWS INTELLIGENCE OS"

Để Proposal của bạn đạt điểm tuyệt đối từ Hội đồng Giám khảo, hãy áp dụng trực tiếp các chỉ dẫn sau khi viết nội dung:

### 1. Phần "Đặt vấn đề & Giải pháp" (Painpoint & Solution)
*   **Tránh viết:** *"Hệ thống giúp fact-check tin tức."* (Giám khảo sẽ đánh giá đây là công cụ đơn giản, dễ bị trùng với Perplexity hoặc các trang web check tin có sẵn).
*   **Hãy viết:** *"AI News Intelligence OS là hệ thống hỗ trợ toàn bộ vòng đời sản xuất tin tức của tòa soạn (Newsroom Lifecycle). Hệ thống giải quyết 3 nỗi đau chính của tòa soạn số: Sự quá tải tín hiệu từ MXH, sự chậm trễ của quy trình xác minh thủ công, và rủi ro pháp lý khi xuất bản tin chưa được kiểm chứng. Giải pháp của chúng tôi không thay thế nhà báo viết bài, mà đóng vai trò Copilot giúp nhà báo ra quyết định xuất bản nhanh và chính xác hơn."*

### 2. Phần "Thiết kế tổng quan" (System Architecture)
*   **Yêu cầu vẽ sơ đồ rõ ràng:** Đảm bảo sơ đồ kiến trúc thể hiện rõ luồng đi của dữ liệu từ các API BTC.
*   **Mô tả rõ 3 chỉ số cốt lõi mà AI tính toán:**
    1.  **Trust Score (Độ tin cậy - 0 đến 100):** Tính toán dựa trên độ uy tín của nguồn tin gốc (Authority Score), số lượng nguồn tin cùng xác nhận (Evidence Count), và mức độ đồng thuận giữa các nguồn (Cross-source Agreement).
    2.  **Impact Score (Mức độ tác động - 0 đến 100):** Tính toán dựa trên mức độ lan truyền trên mạng xã hội (tích hợp vnSocial), sắc thái phản ứng dư luận (Sentiment) và phân loại lĩnh vực ảnh hưởng (Kinh tế, Xã hội, Rủi ro chính trị).
    3.  **Priority Score (Độ ưu tiên - 0 đến 100):** Sự kết hợp logic giữa Trust Score và Impact Score để đưa ra cảnh báo cho Tổng biên tập: *Có cần biên tập gấp và xuất bản ngay lập tức hay không?*

### 3. Phần "Phương hướng triển khai" (Implementation Plan)
*   **Mô tả rõ vai trò của từng API VNPT:**
    *   *vnSocial:* Lấy dữ liệu hot trend và sắc thái thảo luận của dư luận (đầu vào cho việc xếp hạng và tính toán Impact Score).
    *   *SmartReader (OCR):* Bóc tách thông tin từ các ảnh chụp công văn hành chính, văn bản PDF từ các cơ quan nhà nước để đối chiếu tính xác thực của claim.
    *   *SmartVoice (STT):* Chuyển hội thoại từ họp báo, ghi âm phỏng vấn trực tiếp của phóng viên thành văn bản để đưa vào hệ thống kiểm chứng tự động.
    *   *SmartBot:* Trợ lý đắc lực giúp Editor tra cứu nhanh bằng ngôn ngữ tự nhiên: *"Công văn số X ngày Y của Bộ GD&ĐT có nội dung gì?"* hoặc *"Trend này đang lan truyền ở các nguồn nào?"*
    *   *SmartUX:* Phân tích hành vi tương tác của Editor trên dashboard để cải tiến luồng làm việc (workflow) tối ưu nhất.

---

## IV. BƯỚC HÀNH ĐỘNG TIẾP THEO (NEXT ACTIONS)
1.  [ ] **Rà soát lại tài liệu Proposal hiện tại:** Đối chiếu từng tiêu chí ở bảng trên để chấm điểm thử.
2.  [ ] **Bổ sung số liệu thực tế:** Đưa số liệu về số lượng tòa soạn tại Việt Nam và thời gian tác nghiệp thực tế của Editor vào phần đặt vấn đề.
3.  [ ] **Cập nhật hình ảnh/Figma:** Đảm bảo có ít nhất 2 màn hình mockup UI (màn hình Dashboard giám sát tín hiệu và màn hình báo cáo chi tiết của 1 Claim).
4.  [ ] **Đọc soát chính tả:** Nhờ ít nhất một thành viên đọc lại toàn bộ tài liệu để soát lỗi từ ngữ trước khi xuất PDF gửi ban tổ chức.
