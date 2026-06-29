# Kế Hoạch Triển Khai MVP HypeRoom Trong 1 Tuần (29/06/2026 - 06/07/2026)

Tài liệu này vạch ra kế hoạch phát triển sản phẩm khả dụng tối thiểu (MVP) cho hệ thống **HypeRoom** trong vòng **1 tuần**. Kế hoạch được thiết kế tối giản hóa các tác vụ (split tasks to minimum), làm rõ yêu cầu (Requirements) và tiêu chí nghiệm thu (Acceptance Criteria - AC) cho từng cấu phần dựa trên tài liệu kiến trúc [SystemArchitecture.md](file:///D:/HackAIthon%202026/VietnameseHackAIthon2026-SocialMedia/docs/architectures/SystemArchitecture.md) và các chứng minh khái niệm [pocs/](file:///D:/HackAIthon%202026/VietnameseHackAIthon2026-SocialMedia/pocs).

---

## 1. Lựa Chọn Công Nghệ & Khung Kiến Trúc (Tech Stack & Architecture)

Để hoàn thành MVP chạy được (production-ready) trong 1 tuần, chúng ta tối ưu hóa cấu trúc hiện tại bằng cách hợp nhất Backend giả lập và các POC Python thành một hệ thống thực tế:

| Cấu phần | Công nghệ lựa chọn | Lý do & Vai trò |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) + Tailwind CSS + Anime.js | Đã có sẵn khung trong [app/client/](file:///D:/HackAIthon%202026/VietnameseHackAIthon2026-SocialMedia/app/client). Dùng Tailwind CSS để tối ưu giao diện và Anime.js cho chuyển động mượt mà. |
| **Backend** | Python FastAPI (Thay thế Express Node.js) | FastAPI hỗ trợ xử lý bất đồng bộ tốt, tự động sinh tài liệu Swagger và tương thích trực tiếp với các mô hình AI/ML (SBERT, Reranker) và công cụ cào dữ liệu (`trafilatura`) từ POC. |
| **Cơ sở dữ liệu** | PostgreSQL + `pgvector` | Lưu trữ dữ liệu nghiệp vụ và Vector Embedding (768 chiều) trong cùng một cơ sở dữ liệu để đơn giản hóa vận hành. |
| **Nhúng ngữ nghĩa** | `keepitreal/vietnamese-sbert` | Mô hình SBERT tiếng Việt gọn nhẹ, chạy nhanh trên CPU/GPU để tính toán độ tương đồng ngữ nghĩa. |
| **Tái xếp hạng** | `BAAI/bge-reranker-base` | Tái xếp hạng các chứng cứ tìm được để lọc ra context tốt nhất cho LLM. |
| **Tìm kiếm trực tuyến**| Tavily API + Trafilatura | Tìm kiếm tin tức chéo trên các trang báo chính thống Việt Nam và trích xuất nội dung văn bản sạch. |
| **AI LLM Engine** | VNPT SmartBot (hoặc Mock API tương thích) | Động cơ LLM để trích xuất Claims, đánh giá Trust/Risk và sinh Outlines bài viết. |

---

## 2. Kiến Trúc Luồng Dữ Liệu MVP (Data Flow)

Kiến trúc MVP tinh gọn tập trung vào **Luồng 2: USER INPUT-TO-OUTLINE** (Biên tập viên tải tài liệu/nhập văn bản $\rightarrow$ Trích xuất $\rightarrow$ Đối chiếu RAG $\rightarrow$ Đánh giá rủi ro $\rightarrow$ Sinh Outline) và **Luồng 1: HOT NEWS** (đọc tin nóng qua Cronjob).

```mermaid
flowchart TD
    subgraph Client ["Frontend (React UI)"]
        Dashboard["Trang giám sát & Soạn thảo"]
        Upload["Form Upload File / Nhập Text"]
    end

    subgraph API ["Backend (FastAPI)"]
        Gateway["Router API Gateway"]
        VerifyWorker["Verify Pipeline Manager"]
        RAGRouter["Hybrid RAG Router"]
        Scraper["Trafilatura Scraper"]
    end

    subgraph AI ["AI & LLM Services"]
        EmbedModel["vietnamese-sbert (768d)"]
        Reranker["bge-reranker-base"]
        SmartBot["VNPT SmartBot (LLM)"]
    end

    subgraph DB ["Database (Docker)"]
        PGVector[("PostgreSQL + pgvector")]
    end

    subgraph External ["Dịch vụ bên ngoài"]
        Tavily["Tavily Search API"]
        SmartReader["VNPT SmartReader (OCR)"]
        SmartVoice["VNPT SmartVoice (STT)"]
        vnSocial["VNPT vnSocial API"]
    end

    %% Flow connections
    Upload -->|1. Post Document / Text| Gateway
    Gateway -->|2. Gọi OCR/STT nếu là File| SmartReader & SmartVoice
    SmartReader & SmartVoice -->|3. Trả về Text sạch| Gateway
    Gateway -->|4. Lưu DB & Tạo Task| PGVector
    Gateway -->|5. Kích hoạt bất đồng bộ| VerifyWorker
    
    VerifyWorker -->|6. Trích xuất Claims (JSON)| SmartBot
    VerifyWorker -->|7. Nhúng câu truy vấn| EmbedModel
    VerifyWorker -->|8. Tìm kiếm Local| PGVector
    VerifyWorker -->|9. Fallback Online| Tavily
    Tavily -->|10. Lấy link| Scraper
    Scraper -->|11. Trích xuất full text| VerifyWorker
    VerifyWorker -->|12. Xếp hạng chứng cứ| Reranker
    VerifyWorker -->|13. Tính Trust & Risk Score| SmartBot
    VerifyWorker -->|14. Sinh Story Angles & Outline| SmartBot
    VerifyWorker -->|15. Lưu kết quả cuối cùng| PGVector
    
    VerifyWorker -.->|16. Thông báo hoàn thành| Dashboard
```

---

## 3. Thiết Kế API Cốt Lõi (API Contract Design)

Tất cả các API sẽ phản hồi JSON chuẩn hóa.

### 3.1. Tiếp nhận & Kiểm chứng tài liệu
*   **Endpoint:** `POST /api/verifications`
*   **Content-Type:** `multipart/form-data` hoặc `application/json`
*   **Request Payload (Văn bản trực tiếp):**
    ```json
    {
      "content": "Có tin đồn Bộ Tài chính sẽ tăng thuế VAT lên 12% từ tháng sau.",
      "title": "Tin đồn tăng thuế VAT"
    }
    ```
*   **Request Payload (Upload file):**
    *   `file`: Binary File (`.pdf`, `.png`, `.jpg`, `.mp3`, `.wav`)
*   **Response (202 Accepted):**
    ```json
    {
      "id": "verification_uuid_12345",
      "status": "processing",
      "file_name": "Cong_van_08_signed.pdf",
      "created_at": "2026-06-29T13:40:00Z"
    }
    ```

### 3.2. Lấy danh sách lịch sử xác minh
*   **Endpoint:** `GET /api/verifications`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": "verification_uuid_12345",
        "title": "Tin đồn tăng thuế VAT",
        "file_name": "Cong_van_08_signed.pdf",
        "status": "verified",
        "trust_score": 85,
        "risk_level": "Low",
        "created_at": "2026-06-29T13:40:00Z"
      }
    ]
    ```

### 3.3. Chi tiết kết quả kiểm chứng
*   **Endpoint:** `GET /api/verifications/{id}`
*   **Response (200 OK):**
    ```json
    {
      "id": "verification_uuid_12345",
      "title": "Tin đồn tăng thuế VAT",
      "file_name": "Cong_van_08_signed.pdf",
      "status": "verified",
      "ocr_text": "Toàn bộ nội dung văn bản sau khi OCR hoặc STT...",
      "trust_score": 85,
      "risk_level": "Low",
      "sentiment": {
        "positive": 10,
        "negative": 75,
        "neutral": 15
      },
      "claims": [
        {
          "statement": "Bộ Tài chính tăng thuế suất VAT lên 12%",
          "verdict": "Sai",
          "confidence": 95
        }
      ],
      "evidences": [
        {
          "title": "Bộ Tài chính bác bỏ tin đồn tăng thuế VAT lên 12%",
          "link": "https://chinhphu.vn/bo-tai-chinh-bac-bo-tin-don-vat",
          "snippet": "Đại diện Bộ Tài chính khẳng định không đề xuất tăng thuế VAT lên 12%...",
          "similarity": 0.89
        }
      ],
      "story_angles": [
        {
          "title": "Fact-Check Bulletin",
          "content": "Hi Lok! Bản tin đính chính thông tin thuế suất VAT..."
        }
      ],
      "created_at": "2026-06-29T13:40:00Z"
    }
    ```

### 3.4. Quét tin nóng (vnSocial Trending)
*   **Endpoint:** `GET /api/social/trending`
*   **Response (200 OK):**
    ```json
    {
      "timestamp": "2026-06-29T13:40:00Z",
      "feeds": [
        {
          "keyword": "Thuế VAT 12%",
          "controversy_score": 0.85,
          "mention_volume": 1250,
          "sentiment_neg_ratio": 0.78
        }
      ]
    }
    ```

---

## 4. Thiết Kế Môi Trường Docker MVP (Docker Infrastructure)

Chúng ta đóng gói toàn bộ môi trường chạy bằng Docker Compose bao gồm 3 dịch vụ chính nhằm đảo bảo chạy đồng bộ trên máy của khách hàng hoặc ban giám khảo.

Tệp tin cấu hình đề xuất `docker-compose.yml`:
```yaml
version: '3.8'

services:
  db:
    image: ankane/pgvector:latest
    container_name: hyperoom-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: hyperoom_db
      POSTGRES_USER: hyperoom_user
      POSTGRES_PASSWORD: hyperoom_password
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hyperoom_user -d hyperoom_db"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: always

  backend:
    build:
      context: ./app/server
      dockerfile: Dockerfile
    container_name: hyperoom-backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://hyperoom_user:hyperoom_password@db:5432/hyperoom_db
      - TAVILY_API_KEY=${TAVILY_API_KEY}
      - VNPT_SMARTBOT_TOKEN=${VNPT_SMARTBOT_TOKEN}
      - ENVIRONMENT=production
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./app/server:/app
      - huggingface_cache:/root/.cache/huggingface
    restart: always

  frontend:
    build:
      context: ./app/client
      dockerfile: Dockerfile
    container_name: hyperoom-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

volumes:
  pgdata:
  huggingface_cache:
```

---

## 5. Chiến Lược Kiểm Thử (Testing Strategy)

Đảm bảo độ tin cậy của thuật toán đánh giá bằng việc tích hợp tự động các bài kiểm thử:

### 5.1. Kiểm thử đơn vị (Unit Tests)
*   **Công cụ:** `pytest` (Backend Python).
*   **Mục tiêu kiểm thử:**
    *   Thuật toán tính điểm tin cậy `Trust Score`:
        $$\text{Trust Score} = w_{\text{source}} \times \text{Semantic Alignment Score}$$
        Đảm bảo nếu nguồn là `chinhphu.vn` ($w=1.0$), điểm số cao hơn nguồn mạng xã hội ($w=0.3$) với cùng một độ tương đồng ngữ nghĩa.
    *   Hàm phân loại rủi ro pháp lý (`Risk Level`): Phân loại chính xác Low/Medium/High dựa trên ma trận Trust Score và Impact Score.
    *   Hàm trích xuất tên miền đáng tin cậy từ URL.

### 5.2. Kiểm thử tích hợp (Integration Tests)
*   **Mục tiêu kiểm thử:**
    *   **Vector Search Flow:** Chèn bài viết mẫu $\rightarrow$ Thực hiện nhúng bằng `vietnamese-sbert` $\rightarrow$ Lưu vào pgvector $\rightarrow$ Gọi tìm kiếm Cosine Similarity $\rightarrow$ Khớp đúng tài liệu có nghĩa gần nhất.
    *   **API Verification Endpoint:** Giả lập (Mock) gọi đến VNPT SmartBot API và Tavily Search API. Đảm bảo API trả về mã `202` và sau đó cập nhật đúng trạng thái sang `verified` hoặc `warning` trong database.
    *   **Scraper Flow:** Mock HTML phản hồi để kiểm tra thư viện `trafilatura` bóc tách đúng nội dung text chính, loại bỏ quảng cáo/footer.

---

## 6. Phân Rã Công Việc 1 Tuần (Daily Execution Tasks)

Kế hoạch chia nhỏ thành 5 giai đoạn, bắt đầu từ ngày 29/06/2026 và nghiệm thu vào ngày 06/07/2026.

### 📅 Ngày 1 (29/06): Dựng Hạ Tầng Docker & Khởi Tạo Dự Án Backend
*   **Yêu cầu (Requirements):**
    *   Cấu hình Docker Compose chạy được PostgreSQL + pgvector và cài đặt môi trường FastAPI.
    *   Khởi tạo cấu trúc dự án backend bằng Python FastAPI thay thế Node.js Express cũ.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   [ ] Lệnh `docker compose up -d db` khởi động thành công PostgreSQL có extension `vector`.
    *   [ ] Endpoint `/api/health` của FastAPI phản hồi status `SYSTEM_READY` thành công.
    *   [ ] Kết nối DB từ FastAPI hoạt động và chạy tự động các câu lệnh khởi tạo bảng `articles` và `verifications`.

### 📅 Ngày 2 (30/06): Xây Dựng Core Engine - Trích Xuất Claims & Hybrid RAG
*   **Yêu cầu (Requirements):**
    *   Tích hợp mô hình `vietnamese-sbert` để nhúng văn bản cục bộ.
    *   Viết Module tìm kiếm chéo (Hybrid RAG Router): Gọi tìm kiếm trong pgvector trước, nếu tương đồng < 0.75 thì gọi Tavily API để tìm trực tuyến (chỉ lấy các trang báo chính thống).
    *   Tích hợp `trafilatura` để cào bài viết gốc trực tuyến.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   [ ] Hàm `search_similar_articles` trong backend tìm kiếm và khớp đúng kết quả từ bảng `articles` bằng khoảng cách Cosine (`<=>`).
    *   [ ] Khi không có kết quả local thích hợp, hệ thống tự động fallback sang Tavily API và lọc đúng các bài thuộc danh sách tên miền chính thống (VTV, Chính phủ, Tuổi trẻ...).
    *   [ ] Text trích xuất từ link báo mạng không chứa mã HTML, CSS hay quảng cáo rác.

### 📅 Ngày 3 (01/07): Xây Dựng Trust & Risk Engine & Tích Hợp SmartBot
*   **Yêu cầu (Requirements):**
    *   Cài đặt mô hình tái xếp hạng `bge-reranker-base` để sắp xếp tài liệu chứng cứ.
    *   Xây dựng thuật toán tính toán `Trust Score` (độ tin cậy) theo trọng số nguồn tin và `Risk Level` (rủi ro pháp lý theo Luật Báo chí Việt Nam).
    *   Tạo Client kết nối VNPT SmartBot API (sử dụng API key thực tế hoặc mock thông minh hỗ trợ Q&A dựa trên context).
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   [ ] Phán quyết độ tin cậy được phân thành 3 mức trực quan: Đúng (🟢), Sai (🔴), Chưa xác minh (🟡).
    *   [ ] Risk Engine đánh giá chính xác mức rủi ro (Low / Medium / High) và xuất báo cáo rủi ro dạng Markdown.
    *   [ ] Trợ lý ảo tác nghiệp (SmartBot API) trả lời thông tin chính xác dựa trên dữ liệu ngữ cảnh truyền lên, luôn mở đầu bằng câu `"Hi Lok"`.

### 📅 Ngày 4 (02/07): Hoàn Thiện API Endpoints & Workers Bất Đồng Bộ
*   **Yêu cầu (Requirements):**
    *   Xây dựng các REST API Endpoints: Tiếp nhận file/text (`/api/verify`), lịch sử (`/api/verifications`), chi tiết báo cáo (`/api/verifications/{id}`).
    *   Xử lý tác vụ nặng (nhúng vector, cào web, suy luận LLM) dưới dạng chạy ngầm (Background Tasks trong FastAPI) để tránh nghẽn luồng HTTP.
    *   Tích hợp mock/real API của VNPT SmartReader (OCR hình ảnh/PDF) và SmartVoice (STT ghi âm).
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   [ ] Khi gọi `POST /api/verify` kèm tệp tin PDF, API phản hồi ngay lập tức mã trạng thái `202` kèm `id` tiến trình mà không bắt Client chờ lâu.
    *   [ ] Tác vụ chạy ngầm hoàn thành sẽ cập nhật trạng thái trong database từ `processing` thành `verified` hoặc `warning`.
    *   [ ] Dữ liệu OCR và STT được chuyển đổi và lưu chính xác vào trường `ocr_text`.

### 📅 Ngày 5 (03/07): Kết Nối Giao Diện Frontend (React Integration)
*   **Yêu cầu (Requirements):**
    *   Kết nối các component UI React trong `app/client` với API FastAPI thực tế thay cho dữ liệu Mock tĩnh cũ.
    *   Hiển thị biểu đồ phân bố điểm số (Trust/Risk), sơ đồ các nguồn chứng cứ liên kết, và hiển thị Markdown nội dung dàn ý (Story Outlines).
    *   Tích hợp khung chat hỏi đáp với Trợ lý tác nghiệp SmartBot qua API/WebSocket.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   [ ] Giao diện Dashboard hiển thị danh sách lịch sử xác thực đồng bộ thời gian thực từ database.
    *   [ ] Biên tập viên có thể tải lên tài liệu mới từ giao diện và thấy trạng thái xử lý cập nhật tự động.
    *   [ ] Khung chat SmartBot trả về câu trả lời định dạng chuẩn, có trích dẫn nguồn đối chiếu rõ ràng.

### 📅 Ngày 6 (04/07): Viết Unit/Integration Tests & Sửa Lỗi (Bug Fixing)
*   **Yêu cầu (Requirements):**
    *   Viết toàn bộ Unit tests cho Trust Engine, Risk Engine và RAG Routing.
    *   Viết Integration tests cho các endpoints FastAPI chính.
    *   Tối ưu hóa tốc độ tải mô hình SBERT và Reranker (sử dụng cache cục bộ trong Docker volume).
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   [ ] Chạy lệnh `pytest` trong container backend đạt tỉ lệ pass 100% và độ bao phủ code (Coverage) > 80%.
    *   [ ] Các API bên thứ ba (VNPT, Tavily) được mock hoàn toàn trong test suite để có thể chạy offline độc lập.

### 📅 Ngày 7 (05/07): Nghiệm Thu Sản Phẩm & Đóng Gói Docker Toàn Diện
*   **Yêu cầu (Requirements):**
    *   Chạy thử nghiệm toàn bộ hệ thống từ đầu đến cuối (End-to-End User Flow) trên môi trường Docker sạch.
    *   Chuẩn bị tài liệu hướng dẫn vận hành nhanh (`README.md` mới) cho người dùng cuối và ban giám khảo.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   [ ] Chỉ cần chạy lệnh duy nhất `docker compose up --build` là toàn bộ hệ thống (UI, Backend, DB pgvector) tự động cấu hình và sẵn sàng hoạt động tại cổng mặc định.
    *   [ ] Sản phẩm đáp ứng đầy đủ yêu cầu nghiệp vụ về Luật Báo chí Việt Nam và bảo đảm an toàn thông tin số.

---

## 8. Quản Trị Rủi Ro MVP (Risk Management)

| Rủi ro kỹ thuật | Mức độ | Biện pháp giảm thiểu rủi ro cho MVP |
| :--- | :--- | :--- |
| **Hết hạn hoặc mất kết nối Tavily API / VNPT API** | Cao | Thiết lập chế độ **Mock Fallback** thông minh trong Backend. Nếu API lỗi hoặc thiếu API Key trong `.env`, hệ thống tự động trả về dữ liệu mẫu có cấu trúc thực tế để không làm gián đoạn trải nghiệm người dùng. |
| **Mô hình SBERT / Reranker khởi động quá lâu hoặc tốn RAM** | Trung bình | Tải trước các mô hình vào thư mục cache của Docker Volume khi build container. Sử dụng phiên bản mô hình CPU-optimized thu gọn (ONNX hoặc FP16). |
| **Không tải được nội dung bài viết từ các trang báo có tường lửa chặn bot** | Trung bình | `trafilatura` có cơ chế giả lập User-Agent. Nếu vẫn bị chặn, hệ thống sẽ sử dụng phần tóm tắt văn bản (Snippet) do Tavily trả về làm bằng chứng để tính toán. |
