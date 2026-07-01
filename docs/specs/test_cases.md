# Test Cases Spec

## Scope

- Unit test bằng `pytest`.
- Integration test chạy với DB test `PostgreSQL + pgvector`.
- VNPT và Tavily phải có mock adapter để test offline.
- Bộ test phải phản ánh đúng MVP: `pgvector` là hiện thực local retrieval, nhưng toàn bộ adapter VNPT vẫn tồn tại trong contract test.

## Unit Tests

### Trust Engine

- Cùng semantic score, nguồn `government` phải cho trust cao hơn `social`.
- Claim mâu thuẫn trực tiếp với evidence phải ra `contradicted`.
- Claim thiếu chứng cứ phải ra `unverified`.

### Risk Engine

- `trust_score` thấp + `impact_score` cao -> `high`.
- `trust_score` cao + `impact_score` thấp -> `low`.
- Override từ human feedback phải cập nhật state hiện hành và tạo audit event.

### RAG Router

- Similarity `>= 0.75` -> không gọi Tavily.
- Similarity `< 0.75` -> gọi Tavily đúng 1 lần.
- Chỉ chấp nhận domain trong allowlist báo chính thống.

### Evidence Processing

- `trafilatura` loại HTML thừa, script và footer.
- Upsert evidence theo URL canonical, không tạo bản ghi trùng.
- Embedding tạo đúng chiều `768`.

### SmartBot Contract

- Parse được JSON claim extraction.
- Nếu provider timeout, service trả mã lỗi chuẩn.
- Feedback chat tạo `feedback_events.event_type=smartbot_feedback`.
- Answer có citation phải truy ngược được `evidence_id` hợp lệ.

## Integration Tests

### Verification API Flow

1. `POST /api/verifications` với text hợp lệ.
2. Assert response `202`.
3. Worker mock chạy xong.
4. `GET /api/verifications/{id}` trả claims, evidences, scores, outline.

### OCR/STT Flow

1. Upload file mẫu.
2. Mock SmartReader hoặc SmartVoice trả text chuẩn hóa.
3. Assert `sources.raw_text` được lưu.
4. Assert verification chuyển sang `verified` hoặc `warning`.

### Local Vector Retrieval

1. Seed 3 evidence documents vào DB.
2. Query 1 claim gần nghĩa.
3. Assert top result đúng mong đợi.
4. Assert truy vấn dùng `pgvector` cosine search.

### Tavily Fallback

1. Seed DB với evidence không liên quan.
2. Mock Tavily trả 2 URLs.
3. Mock scraper trả clean text.
4. Assert evidence mới được upsert và gắn vào claim.

### Feedback Persistence

1. Tạo verification hoàn tất.
2. Gọi `POST /api/verifications/{id}/feedback`.
3. Assert state hiện hành đổi đúng.
4. Assert `feedback_events` tăng 1 bản ghi.
5. Assert có thể đọc lại cả state hiện hành lẫn lịch sử trước/sau chỉnh sửa.

### Verification Provenance

1. Tạo verification hoàn tất.
2. Gọi `GET /api/verifications/{id}`.
3. Assert response có `pipeline_version` hoặc `provenance`.
4. Assert provider trace khớp với `verification_jobs`.

### SmartBot WebSocket

1. Kết nối `/api/ws/smartbot`.
2. Gửi `user_prompt`.
3. Mock SmartBot trả answer có citation.
4. Gửi `feedback`.
5. Assert DB lưu feedback.

## Mock Contracts

### VNPT SmartBot Mock

- Input: prompt + context.
- Output: claim extraction JSON, verdict JSON, outline markdown, chat answer.
- Có mode lỗi: timeout, malformed JSON.

### VNPT SmartReader Mock

- Input: file binary.
- Output: `task_id`, rồi result text hoặc sync fake result trong test.

### VNPT SmartVoice Mock

- Input: audio file.
- Output: transcript text.

### Tavily Mock

- Input: query, allowlist domains.
- Output: list URL + title + snippet.

## Acceptance Threshold

- Unit tests pass 100%.
- Integration tests pass với mock providers.
- Không test nào phụ thuộc internet thật.
- Coverage tối thiểu: core verification services, routers, repositories.
