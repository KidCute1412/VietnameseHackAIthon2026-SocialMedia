# MVP Roadmap

## Daily Tasks

### Day 1 - Baseline, Hosting, One-Command Setup

- Chốt kiến trúc deploy MVP: `Vercel` cho frontend, `Render` cho backend, `Supabase` cho PostgreSQL + `pgvector`.
- Dựng `docker compose` local để demo và kiểm thử bằng một lệnh.
- Hoàn tất `GET /api/health` và schema nền trên Supabase/local.

### Day 2 - Claim Extraction và Retrieval trên pgvector

- Tích hợp embedding `keepitreal/vietnamese-sbert` 768 chiều.
- Tạo local retrieval trên `pgvector`.
- Viết rule fallback Tavily khi similarity `< 0.75`.

### Day 3 - Trust, Risk, Evidence Ranking

- Tích hợp reranker.
- Chuẩn hóa verdict, trust score, risk level.
- Tạo SmartBot adapter thật hoặc mock tương thích.

### Day 4 - Async Pipeline, Redis/Queue & REST APIs

- Cấu hình Celery/RQ với Upstash Redis làm message broker & kết quả store.
- Hoàn tất `POST /api/verifications`, list, detail, feedback.
- Chuyển OCR/STT và các tác vụ nặng qua Redis Queue worker xử lý bất đồng bộ.
- Lưu job events và error states trong PostgreSQL.

### Day 5 - Frontend Integration, UX, SmartBot WebSocket

- Nối dashboard với API thật.
- Hiển thị claims, evidences, scores, outline.
- Tích hợp chat SmartBot qua WebSocket.
- Rà soát luồng thao tác chính trên desktop/mobile ưu tiên và các điểm accessibility cơ bản.

### Day 6 - Test Suite, Stability, Security

- Viết unit tests cho trust, risk, RAG router.
- Viết integration tests cho verification flow, feedback, websocket.
- Khóa mock contract cho VNPT/Tavily.
- Chạy tối thiểu 3 vòng smoke test liên tiếp trên môi trường local hoặc staging.
- Soát cấu hình secrets, CORS, logging, và dữ liệu nhạy cảm.

### Day 7 - Demo Rehearsal, Packaging, GTM & Unit Costs

- Chạy E2E trên môi trường Docker sạch (gồm cả web, api, redis, worker).
- Soát dữ liệu demo, fallback và log lỗi.
- Hoàn tất hướng dẫn cài đặt/chạy một lệnh (docker-compose up) và checklist trình diễn.
- Hoàn thiện mô hình kinh doanh (GTM), đơn giá đơn vị dịch vụ (Unit Costs) dựa trên chi phí API VNPT/Tavily và LLM.
- Tổng hợp điểm nâng cấp so với Vòng 1 và phương án mở rộng hạ tầng khi tăng tải.

## Risk Governance

### Architectural Constraints

- MVP chỉ dùng `PostgreSQL + pgvector` trên Supabase; không dùng `Qdrant Cloud` làm vector store.
- MVP chưa tích hợp `SmartUX SDK`.
- Sử dụng kiến trúc bất đồng bộ qua Redis và Queue cho các tác vụ tải nặng (OCR, STT).

### Top Risks

- Provider VNPT hoặc Tavily lỗi: dùng mock adapter và fallback state `warning`.
- Free tier Render sleep hoặc cold start: chuẩn bị flow warm-up và demo script ngắn.
- Model tải chậm: preload cache trong Docker volume hoặc build artifact phù hợp.
- Nguồn báo chặn scraper: dùng snippet Tavily làm bằng chứng tạm thời.
- Kết quả AI bị sửa tay: luôn lưu `feedback_events` để audit.
- Phụ thuộc mạng khi demo: luôn có dữ liệu seed và mock mode để chạy offline cục bộ.

### Demo Rules

- Không mô tả mock là production-ready.
- Mọi answer SmartBot phải có citation khi tham chiếu chứng cứ.
- Ưu tiên luồng `text/file -> verification -> outline -> feedback` làm demo chính.
- Bản demo phải chứng minh được: chạy ổn định, thao tác rõ ràng, và có đường nâng cấp sau MVP.

## Round 2 Alignment

### Product Completion

- Có kịch bản `docker compose up --build` để chạy local một lệnh.
- Có script test hoặc checklist xác nhận pass trước demo.
- Có bằng chứng hệ thống chạy ổn định ít nhất 3 lần.

### User Experience

- Tập trung vào 1-2 persona chính: biên tập viên và reviewer.
- Ưu tiên màn hình upload, kết quả xác minh, feedback, và chat SmartBot.
- Ghi nhận UX metrics tối thiểu: thời gian tạo verification, thời gian trả kết quả, tỉ lệ hoàn tất tác vụ demo.

### Deployment and Scale

- Tài liệu phải nêu rõ đường chạy hiện tại trên free tier và đường nâng cấp khi tăng tải.
- Hướng mở rộng sau MVP: tách worker, cache, queue, và tối ưu indexing `pgvector`.

### Upgrade Story

- Nêu rõ cải tiến so với Vòng 1: có verification pipeline thực, feedback persistence, và SmartBot contract rõ ràng.
- Ghi lại các phản hồi mentor đã áp dụng vào kiến trúc hoặc phạm vi MVP.
