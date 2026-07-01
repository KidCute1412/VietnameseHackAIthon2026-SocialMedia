# API Endpoints Spec

## Scope

- Backend: FastAPI.
- Transport: REST cho CRUD/job state, WebSocket cho SmartBot realtime.
- MVP vẫn giữ tích hợp **VNPT SmartUX** ở mức tối thiểu để thu thập tín hiệu tương tác; frontend tiếp tục gọi API trực tiếp cho luồng nghiệp vụ chính.

## Conventions

- Base path: `/api`.
- Response JSON có `data` hoặc `error`.
- Async pipeline trả `202 Accepted` với `verification_id`.
- Canonical `verification.status`: `queued`, `processing`, `verified`, `warning`, `failed`.
- Canonical `verdict`: `supported`, `contradicted`, `unverified`, `mixed`.
- `warning` là trạng thái hoàn tất có suy giảm chất lượng hoặc fallback provider; không đồng nghĩa với `failed`.
- **Phân quyền & Xác thực (UC10)**:
  - Header bắt buộc: `Authorization: Bearer <JWT_TOKEN>`.
  - Token chứa Claim về vai trò của người dùng: `reporter` (Biên tập viên) hoặc `reviewer` (Người duyệt bài).
  - Các API hiệu chỉnh/phê duyệt chỉ chấp nhận quyền `reviewer`.


## REST APIs

### `POST /api/verifications`

Tạo yêu cầu xác minh từ text, file upload, hoặc trending item.

Request:

```json
{
  "title": "Tin don tang thue VAT",
  "content": "Co tin don Bo Tai chinh tang thue VAT len 12%",
  "source_kind": "text"
}
```

Multipart fields:

- `file`
- `title`
- `source_kind=file_upload`

Response `202`:

```json
{
  "data": {
    "verification_id": "uuid",
    "status": "queued",
    "source_id": "uuid",
    "created_at": "2026-06-30T09:00:00Z"
  }
}
```

Failure:

- `400` invalid input
- `413` file too large
- `415` unsupported media type

### `GET /api/verifications`

Danh sách phiên xác minh.

Query params:

- `status`
- `limit`
- `cursor`

Response `200`:

```json
{
  "data": [
    {
      "verification_id": "uuid",
      "title": "Tin don tang thue VAT",
      "status": "verified",
      "trust_score": 85,
      "risk_level": "low",
      "created_at": "2026-06-30T09:00:00Z"
    }
  ],
  "next_cursor": null
}
```

### `GET /api/verifications/{verification_id}`

Chi tiết kết quả xác minh.

Response `200`:

```json
{
  "data": {
    "verification_id": "uuid",
    "status": "verified",
    "title": "Tin don tang thue VAT",
    "source": {
      "source_id": "uuid",
      "kind": "text",
      "raw_text": "Co tin don...",
      "metadata": {}
    },
    "summary": {
      "verdict": "contradicted",
      "trust_score": 85,
      "impact_score": 62,
      "sentiment_metrics": {
        "positive": 0.1,
        "negative": 0.78,
        "neutral": 0.12
      },
      "risk_level": "low"
    },
    "provenance": {
      "pipeline_version": "mvp-2026-06-30",
      "providers": [
        "vnpt_smartbot",
        "vnpt_vnsocial",
        "tavily"
      ],
      "note": "Provider/model metadata được tổng hợp từ verification_jobs và evidence trace."
    },
    "claims": [],
    "evidences": [],
    "outline_md": "## Story angle",
    "risk_report_md": "## Risk"
  }
}
```

### `POST /api/verifications/{verification_id}/feedback`

Ghi nhận hiệu chỉnh Human-in-the-Loop.

Request:

```json
{
  "event_type": "risk_override",
  "claim_id": null,
  "before_state": {
    "risk_level": "medium"
  },
  "after_state": {
    "risk_level": "high"
  },
  "reason": "Can them kiem duyet phap ly"
}
```

Response `201`:

```json
{
  "data": {
    "feedback_id": "uuid",
    "applied": true
  }
}
```

Failure:

- `401` Unauthorized (thiếu hoặc sai token)
- `403` Forbidden (nếu role là `reporter`, chỉ cho phép `reviewer`)
- `404` Verification session not found


Rules:

- Cập nhật bản ghi hiện hành trong `verifications` hoặc `claims`.
- Đồng thời append một dòng mới vào `feedback_events`.

### `GET /api/verifications/{verification_id}/feedback`

Trả lịch sử hiệu chỉnh.

### `GET /api/verifications/{verification_id}/events`

Trả timeline job và trạng thái pipeline.

Response `200`:

```json
{
  "data": [
    {
      "job_id": "uuid",
      "job_type": "verify",
      "status": "succeeded",
      "provider": "vnpt_smartbot",
      "started_at": "2026-06-30T09:00:05Z",
      "finished_at": "2026-06-30T09:00:12Z"
    }
  ]
}
```

### `GET /api/social/trending`

Lấy danh sách topic nóng từ vnSocial hoặc mock adapter. Đây là luồng MVP cốt lõi cho dữ liệu trending do người dùng chọn thủ công; chế độ cron tự động vẫn thuộc phạm vi kiến trúc nhưng có thể bật như capability riêng khi demo hoặc triển khai.

Response `200`:

```json
{
  "data": [
    {
      "external_ref": "trend_001",
      "keyword": "Thue VAT 12%",
      "controversy_score": 0.85,
      "mention_volume": 1250,
      "sentiment_neg_ratio": 0.78
    }
  ]
}
```

### `POST /api/social/trending/{external_ref}/verifications`

Tạo verification từ một trending item đã chọn.

Response `202`:

```json
{
  "data": {
    "verification_id": "uuid",
    "status": "queued",
    "source_id": "uuid",
    "created_at": "2026-06-30T09:00:00Z"
  }
}
```

### `GET /api/health`

Response `200`:

```json
{
  "data": {
    "status": "SYSTEM_READY"
  }
}
```

### `POST /api/metrics/smartux`

Đẩy sự kiện/chỉ số tương tác người dùng lên hệ thống (phục vụ UC9).

Request:

```json
{
  "event_type": "copy_editorial_outline",
  "verification_id": "uuid",
  "metadata": {
    "custom_metric": "value"
  }
}
```

Response `201`:

```json
{
  "data": {
    "logged": true
  }
}
```

### `GET /api/verifications/{verification_id}/export`

Xuất đề cương / báo cáo xác minh dưới dạng file Markdown (phục vụ UC11).

Query params:

- `format` (chỉ chấp nhận `markdown` cho MVP)

Response `200` (trả về file với header `Content-Type: text/markdown` hoặc JSON chứa content):

```json
{
  "data": {
    "filename": "report_uuid.md",
    "content": "# Bao cao..."
  }
}
```


## WebSocket SmartBot Contract

### Endpoint

- `GET /api/ws/smartbot?verification_id={uuid}`

### Client Messages

```json
{
  "type": "user_prompt",
  "message_id": "uuid",
  "verification_id": "uuid",
  "prompt": "Tom tat bang chung chinh"
}
```

```json
{
  "type": "feedback",
  "message_id": "uuid",
  "answer_id": "uuid",
  "rating": "up",
  "reason": "Tra loi dung ngu canh"
}
```

### Server Messages

```json
{
  "type": "ack",
  "message_id": "uuid"
}
```

```json
{
  "type": "answer",
  "answer_id": "uuid",
  "message_id": "uuid",
  "content": "Hi Lok-sama",
  "citations": [
    {
      "evidence_id": "uuid",
      "title": "Bo Tai chinh bac bo tin don",
      "url": "https://chinhphu.vn/..."
    }
  ]
}
```

```json
{
  "type": "error",
  "message_id": "uuid",
  "code": "SMARTBOT_TIMEOUT"
}
```

### SmartBot Rules

- SmartBot chỉ dùng context từ verification hiện tại.
- Mọi answer phải có ít nhất 1 citation nếu đang tham chiếu bằng chứng.
- Feedback chat phải lưu vào `feedback_events` với `event_type=smartbot_feedback`.
- MVP chưa cần streaming token; trả từng message hoàn chỉnh là đủ.

## Async State Machine

- `queued` -> `processing` -> `verified`
- `queued` -> `processing` -> `warning`
- `queued` -> `processing` -> `failed`

`warning` dùng khi pipeline hoàn tất nhưng thiếu chứng cứ mạnh hoặc provider fallback.
