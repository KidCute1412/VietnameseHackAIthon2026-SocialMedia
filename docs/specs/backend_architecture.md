# HypeRoom - Backend Architecture Specification

Tài liệu này đặc tả kiến trúc backend của hệ thống **HypeRoom** sử dụng **FastAPI**, bám sát định hướng thiết kế trong [SystemArchitecture.md](file:///D:/HackAIthon%202026/VietnameseHackAIthon2026-SocialMedia/docs/architectures/SystemArchitecture.md) và các yêu cầu kỹ thuật từ bộ API Bruno trong `docs/bruno/HypeRoom`.

---

## 1. Thiết Kế Kiến Trúc: Asynchronous Modular Monolith

HypeRoom áp dụng kiến trúc **Asynchronous Modular Monolith** (Đơn khối dạng mô-đun kết hợp xử lý bất đồng bộ). Đây là mô hình tối ưu nhất cho giai đoạn MVP và khả năng mở rộng (Scale) nhờ việc phân tách rõ ràng luồng xử lý đồng bộ nhanh (Hot Path) và bất đồng bộ nặng (Cold Path).

### 1.1 Sơ đồ Kiến trúc phân lớp & Luồng xử lý nền

```mermaid
flowchart TD
    Client["Client / Frontend / Bruno UI"]
    
    subgraph Routing ["API Routing Layer (Fast API)"]
        Router["FastAPI APIRouter<br><i>(app/server/modules)</i>"]
    end
    
    subgraph TaskQueue ["Asynchronous Task Layer"]
        BgTasks["FastAPI BackgroundTasks<br><i>(or Celery / Redis Queue for Production)</i>"]
    end

    subgraph Modules ["Domain Modules (Business Logic & Core Engines)"]
        VerifyOrch["Verification Orchestrator<br><i>(verification/orchestrator.py)</i>"]
        ClaimExt["Claim Extractor Engine"]
        Retrieval["Evidence Retrieval Engine"]
        TrustEng["Trust Engine"]
        ImpactEng["Impact Engine"]
        RiskEng["Risk Engine"]
        EditorialEng["Editorial Engine"]
    end
    
    subgraph Integration ["Integrations & External Clients"]
        VNPT["vnpt (VNPT Ecosystem Clients)"]
        Tavily["Tavily/Trafilatura Client"]
    end
    
    subgraph Storage ["Database & Persistence"]
        DB["PostgreSQL / SQLite<br><i>(SQLAlchemy Models per Module)</i>"]
    end
    
    %% Flows
    Client -->|"1. HTTP request"| Router
    Router -->|"2. Create DB record (status=PENDING)"| DB
    Router -->|"3. Delegate async task"| BgTasks
    Router -->|"4. Return 202 Accepted"| Client
    
    BgTasks -->|"5. Run background orchestration"| VerifyOrch
    VerifyOrch -->|"Update status=PROCESSING"| DB
    
    VerifyOrch --> ClaimExt
    VerifyOrch --> Retrieval
    VerifyOrch --> TrustEng
    VerifyOrch --> ImpactEng
    VerifyOrch --> RiskEng
    VerifyOrch --> EditorialEng
    
    VerifyOrch -->|Update status=COMPLETED/FAILED| DB
    
    %% Integration integrations
    ClaimExt -.-> VNPT
    Retrieval -.-> Tavily
    TrustEng -.-> VNPT
    ImpactEng -.-> VNPT
    RiskEng -.-> VNPT
    EditorialEng -.-> VNPT
```

### 1.2 Phân tách luồng xử lý (Hot & Cold Paths)

*   **Hot Path (Đồng bộ - Phản hồi nhanh):** Các API truy xuất như đọc bảng tin xu hướng (`GET /trending`), lịch sử kiểm chứng (`GET /verifications`), hay danh sách lịch sử phản hồi (`GET /feedbacks/history`).
*   **Cold Path (Bất đồng bộ - Tác vụ nặng):** Các API tiếp nhận yêu cầu phân tích mới (`POST /verifications`). Hệ thống sẽ không xử lý trực tiếp trên luồng HTTP để tránh timeout và nghẽn hệ thống. Thay vào đó, API Router trả về mã `202 Accepted` ngay lập tức kèm theo ID tác vụ để Client có thể thực hiện cơ chế Polling hoặc lắng nghe qua WebSocket. Tác vụ sẽ được đưa vào hàng đợi chạy nền.


---

## 2. Cấu Trúc Thư Mục Chi Tiết (Feature-Based Modular)

Backend được tổ chức theo từng mô-đun nghiệp vụ (Domain-Driven/Feature Folder) trong thư mục `app/server/` như sau:

```text
app/server/
├── main.py                  # Entrypoint khởi tạo FastAPI app, middlewares & lifespan
├── requirements.txt         # Khai báo thư viện phụ thuộc (fastapi, uvicorn, sqlalchemy, etc.)
├── .env.example             # Cấu hình biến môi trường mẫu
│
├── config.py                # Đọc cấu hình từ biến môi trường (Pydantic Settings)
├── database.py              # Cấu hình kết nối DB (SQLAlchemy engine & Session local)
│
├── integrations/            # Lớp tích hợp hệ thống bên thứ ba & Đối tác ngoài
│   ├── __init__.py
│   ├── vnpt/                # Tích hợp toàn bộ hệ sinh thái dịch vụ VNPT
│   │   ├── __init__.py
│   │   ├── auth.py          # Quản lý authentication / token VNPT vnSocial & Smart APIs
│   │   ├── vnsocial.py      # Client kết nối trực tiếp với vnSocial API (trending, metrics)
│   │   ├── smartbot.py      # Client tương tác API SmartBot (LLM Generation)
│   │   ├── smartreader.py   # Client tích hợp SmartReader (OCR số hóa hình ảnh/PDF)
│   │   └── smartvoice.py    # Client tích hợp SmartVoice (STT chuyển đổi giọng nói)
│   │
│   └── search/              # Tìm kiếm thông tin & cào dữ liệu internet
│       ├── __init__.py
│       └── tavily_client.py # Client tích hợp Tavily & Trafilatura
│
└── modules/                 # Các mô-đun nghiệp vụ chính (Feature Modules)
    ├── __init__.py
    ├── deps.py              # Dependencies dùng chung cho các modules (get_db, auth)
    │
    ├── trending/            # Mô-đun quản lý tin tức / từ khóa xu hướng
    │   ├── __init__.py
    │   ├── router.py        # Endpoints: GET /api/v1/trending
    │   └── schemas.py       # Pydantic validation cho trending
    │
    ├── verification/        # Mô-đun cốt lõi xử lý kiểm chứng dữ liệu
    │   ├── __init__.py
    │   ├── router.py        # Endpoints: POST /verifications, GET /verifications/{id}
    │   ├── models.py        # SQLAlchemy model (Verification, Claim, Evidence, RiskReport)
    │   ├── schemas.py       # Pydantic schemas (VerificationCreate, VerificationResponse)
    │   ├── orchestrator.py  # Điều phối chính luồng xử lý bất đồng bộ (VerifyService)
    │   └── engines/         # Các động cơ nghiệp vụ nhỏ cấu thành quy trình kiểm chứng
    │       ├── __init__.py
    │       ├── claim_extractor.py   # Trích xuất claims/thực thể từ văn bản thô
    │       ├── evidence_retrieval.py# Tìm chứng cứ đa nguồn (Tavily & Search)
    │       ├── trust_engine.py      # Tính toán điểm tin cậy (Trust Score)
    │       ├── impact_engine.py     # Đo lường sức ảnh hưởng dư luận (vnSocial)
    │       ├── risk_engine.py       # Phân tích rủi ro xuất bản (Luật báo chí)
    │       └── editorial_engine.py  # Tạo Story Angles và dàn ý đề xuất
    │
    └── feedback/            # Mô-đun tương tác người dùng / Biên tập viên (Human-in-the-Loop)
        ├── __init__.py
        ├── router.py        # Endpoints: POST /feedbacks, GET /feedbacks/history
        ├── models.py        # SQLAlchemy model (Feedback, AuditLog)
        └── schemas.py       # Pydantic schemas cho Feedbacks
```

---

## 3. Ánh Xạ API Endpoints Từ Bruno

Dưới đây là chi tiết ánh xạ các request định nghĩa trong bộ sưu tập Bruno (`docs/bruno/HypeRoom`) vào cấu trúc API modules của FastAPI:

| Tập tin Bruno | HTTP Method & Path | API Module Router | Mô tả nghiệp vụ |
| :--- | :--- | :--- | :--- |
| `Get Social Trending.bru` | `GET /api/v1/trending` | `modules/trending/router.py` | Lấy danh sách các chủ đề/từ khóa nóng đang lan truyền từ VNPT vnSocial. |
| `Create Verification.bru` | `POST /api/v1/verifications` | `modules/verification/router.py` | Tạo yêu cầu kiểm chứng mới từ nội dung văn bản do người dùng nhập hoặc số hóa. |
| `Create Verification From Trending.bru` | `POST /api/v1/verifications/from-trending` | `modules/verification/router.py` | Tạo yêu cầu kiểm chứng tự động từ một bài đăng hot thuộc danh sách xu hướng vnSocial. |
| `List Verifications.bru` | `GET /api/v1/verifications` | `modules/verification/router.py` | Liệt kê danh sách các yêu cầu kiểm chứng đã thực hiện. |
| `Get Verification Detail.bru` | `GET /api/v1/verifications/{id}` | `modules/verification/router.py` | Xem chi tiết kết quả kiểm chứng (bao gồm danh sách claims, evidences, trust/risk scores). |
| `Get Verification Events.bru` | `GET /api/v1/verifications/{id}/events` | `modules/verification/router.py` | Lấy lịch sử thay đổi/sự kiện liên quan đến yêu cầu kiểm chứng đó. |
| `Create Feedback.bru` | `POST /api/v1/feedbacks` | `modules/feedback/router.py` | Cho phép biên tập viên ghi nhận phản hồi, thay đổi điểm số, nội dung nhãn (Human-in-the-Loop). |
| `Get Feedback History.bru` | `GET /api/v1/feedbacks/history` | `modules/feedback/router.py` | Truy vấn lịch sử phản hồi và vết audit log của hệ thống. |
| `Send SmartUX Metric.bru` | `POST /api/v1/metrics/smartux` | `modules/trending/router.py` | Gửi chỉ số tương tác UX từ frontend về lưu trữ/phân tích (tích hợp VNPT SmartUX). |

---

## 4. Nguyên Tắc Thiết Kế Chi Tiết & Quy Định Code

Bám sát quy tắc của dự án tại `AGENTS.md`:
* **Giữ code nhỏ gọn & đơn giản:** Mỗi file service/engine (như `trust_engine.py`, `risk_engine.py`) chỉ tập trung giải quyết đúng một nhiệm vụ nghiệp vụ duy nhất.
* **Dependencies Injection rõ ràng:** Sử dụng cơ chế Dependency Injection của FastAPI (`Depends`) để inject DB Session (`get_db`) và các API Client, giúp dễ dàng viết Unit Test độc lập.
* **Cách ly API VNPT:** Toàn bộ logic giao tiếp HTTP, xử lý Token/Auth, Retry khi mất kết nối với các dịch vụ của VNPT đều được bọc kín trong thư mục `integrations/vnpt/`. Lớp nghiệp vụ `modules/` tuyệt đối không gọi trực tiếp HTTP request tới VNPT.
* **Xử lý bất đồng bộ (Async/Await):** Các endpoint gọi dịch vụ ngoài cần khai báo `async def` và sử dụng thư viện HTTP client bất đồng bộ (`httpx.AsyncClient`) để không chặn luồng chính của hệ thống.hống. |
| `Send SmartUX Metric.bru` | `POST /api/v1/metrics/smartux` | `api/v1/metrics.py` | Gửi chỉ số tương tác UX từ frontend về lưu trữ/phân tích (tích hợp VNPT SmartUX). |

---

## 4. Nguyên Tắc Thiết Kế Chi Tiết & Quy Định Code

Bám sát quy tắc của dự án tại `AGENTS.md`:
* **Giữ code nhỏ gọn & đơn giản:** Mỗi file service (như `trust_engine.py`, `risk_engine.py`) chỉ tập trung giải quyết đúng một nhiệm vụ nghiệp vụ duy nhất.
* **Dependencies Injection rõ ràng:** Sử dụng cơ chế Dependecy Injection của FastAPI (`Depends`) để inject DB Session (`get_db`) và các API Client, giúp dễ dàng viết Unit Test độc lập.
* **Cách ly API VNPT:** Toàn bộ logic giao tiếp HTTP, xử lý Token/Auth, Retry khi mất kết nối với các dịch vụ của VNPT đều được bọc kín trong thư mục `vnsocial/`. Lớp nghiệp vụ `services/` tuyệt đối không gọi trực tiếp HTTP request tới VNPT.
* **Xử lý bất đồng bộ (Async/Await):** Các endpoint gọi dịch vụ ngoài cần khai báo `async def` và sử dụng thư viện HTTP client bất đồng bộ (`httpx.AsyncClient`) để không chặn luồng chính của hệ thống.
