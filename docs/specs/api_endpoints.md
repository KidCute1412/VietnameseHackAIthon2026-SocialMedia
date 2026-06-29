# API Endpoints Spec

## Scope

- Backend: FastAPI.
- Transport: REST cho CRUD/job state, WebSocket cho SmartBot realtime.
- MVP bỏ `SmartUX SDK`; frontend gọi API trực tiếp.

## Conventions

- Base path: `/api`.
- Response JSON có `data` hoặc `error`.
- Async pipeline trả `202 Accepted` với `verification_id`.

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
      "raw_text": "Co tin don..."
    },
    "summary": {
      "verdict": "contradicted",
      "trust_score": 85,
      "impact_score": 62,
      "risk_level": "low"
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

Rules:

- Cập nhật bản ghi hiện hành trong `verifications` hoặc `claims`.
- Đồng thời append một dòng mới vào `feedback_events`.

### `GET /api/verifications/{verification_id}/feedback`

Trả lịch sử hiệu chỉnh.

### `GET /api/verifications/{verification_id}/events`

Trả timeline job và trạng thái pipeline.

### `GET /api/social/trending`

Lấy danh sách topic nóng từ vnSocial hoặc mock adapter.

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

### `GET /api/health`

Response `200`:

```json
{
  "data": {
    "status": "SYSTEM_READY"
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
