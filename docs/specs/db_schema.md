# Database Schema Spec

## Scope

- MVP dùng một DB duy nhất: `PostgreSQL 16 + pgvector`.
- Embedding lưu trong `vector(768)`.
- Không dùng `Qdrant`, `Milvus`, hoặc vector store riêng cho MVP.
- Bảng evidence trong tài liệu này là hiện thực MVP của lớp `VectorDB` trong kiến trúc logic tại `docs/architectures/SystemArchitecture.md`.

## Extensions

```sql
create extension if not exists vector;
create extension if not exists pgcrypto;
```

## Core Tables

### `users`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid primary key` | User id |
| `email` | `text unique not null` | Login identity |
| `display_name` | `text not null` | Editor name |
| `role` | `text not null` | `editor`, `reviewer`, `admin` |
| `created_at` | `timestamptz not null default now()` | Created time |

### `sources`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid primary key` | Source id |
| `kind` | `text not null` | `text`, `file_upload`, `trending_post`, `ocr`, `stt` |
| `title` | `text` | Optional title |
| `raw_text` | `text` | Input or normalized text |
| `file_name` | `text` | Original file name |
| `mime_type` | `text` | Uploaded file type |
| `external_ref` | `text` | VNPT task id or vnSocial id |
| `metadata` | `jsonb not null default '{}'::jsonb` | Raw source metadata (e.g., vnSocial payload, upload info) |
| `created_by` | `uuid references users(id)` | Actor |
| `created_at` | `timestamptz not null default now()` | Created time |

### `verifications`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid primary key` | Verification id |
| `source_id` | `uuid not null references sources(id)` | Input source |
| `status` | `text not null` | `queued`, `processing`, `verified`, `warning`, `failed` |
| `pipeline_version` | `text not null` | Prompt/model bundle version |
| `trust_score` | `int` | `0-100` |
| `impact_score` | `int` | `0-100`, nullable for manual flow |
| `sentiment_metrics` | `jsonb` | Public sentiment stats (e.g., % positive, negative, neutral) |
| `risk_level` | `text` | `low`, `medium`, `high` |
| `verdict` | `text` | `supported`, `contradicted`, `unverified`, `mixed` |
| `risk_report_md` | `text` | Final markdown report |
| `outline_md` | `text` | Editorial outline |
| `error_message` | `text` | Failure reason |
| `created_by` | `uuid references users(id)` | Request actor |
| `created_at` | `timestamptz not null default now()` | Created time |
| `updated_at` | `timestamptz not null default now()` | Updated time |
| `completed_at` | `timestamptz` | Completion time |

### `claims`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid primary key` | Claim id |
| `verification_id` | `uuid not null references verifications(id)` | Parent verification |
| `statement` | `text not null` | Normalized claim |
| `entity` | `text` | Primary entity |
| `category` | `text` | Claim type |
| `confidence` | `numeric(5,2)` | Extraction confidence |
| `verdict` | `text` | Claim-level verdict |
| `trust_score` | `int` | Claim-level trust |
| `created_at` | `timestamptz not null default now()` | Created time |

### `evidence_documents`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid primary key` | Evidence id |
| `url` | `text unique` | Canonical URL |
| `domain` | `text not null` | Source domain |
| `title` | `text not null` | Evidence title |
| `content` | `text not null` | Clean extracted text |
| `published_at` | `timestamptz` | Source publish time |
| `source_type` | `text not null` | `official`, `press`, `social`, `government` |
| `embedding` | `vector(768)` | Semantic embedding (use vector(1024) if using BGE-M3) |
| `metadata` | `jsonb not null default '{}'::jsonb` | Extra source fields |
| `created_at` | `timestamptz not null default now()` | Created time |

### `claim_evidences`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `claim_id` | `uuid not null references claims(id)` | Claim |
| `evidence_id` | `uuid not null references evidence_documents(id)` | Evidence |
| `rank` | `int not null` | Top-k order |
| `similarity` | `numeric(6,4)` | Cosine similarity |
| `rerank_score` | `numeric(6,4)` | Reranker score |
| `snippet` | `text` | Short cited passage |
| `primary key` | `(claim_id, evidence_id)` | Composite key |

### `verification_jobs`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid primary key` | Job id |
| `verification_id` | `uuid not null references verifications(id)` | Parent verification |
| `job_type` | `text not null` | `ocr`, `stt`, `verify`, `trending_ingest` |
| `status` | `text not null` | `queued`, `running`, `succeeded`, `failed` |
| `attempt_count` | `int not null default 0` | Retry count |
| `provider` | `text` | `vnpt_smartreader`, `vnpt_smartvoice`, `vnpt_vnsocial`, `tavily`, `smartbot` |
| `payload` | `jsonb not null default '{}'::jsonb` | Input snapshot |
| `result` | `jsonb not null default '{}'::jsonb` | Output snapshot |
| `started_at` | `timestamptz` | Start time |
| `finished_at` | `timestamptz` | End time |

## Human-in-the-Loop

### `feedback_events`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid primary key` | Feedback id |
| `verification_id` | `uuid not null references verifications(id)` | Target verification |
| `claim_id` | `uuid references claims(id)` | Optional claim target |
| `actor_id` | `uuid not null references users(id)` | Editor/reviewer |
| `event_type` | `text not null` | `claim_edit`, `verdict_override`, `risk_override`, `outline_edit`, `smartbot_feedback` |
| `before_state` | `jsonb not null default '{}'::jsonb` | Previous value |
| `after_state` | `jsonb not null default '{}'::jsonb` | Final value |
| `reason` | `text` | Human rationale |
| `created_at` | `timestamptz not null default now()` | Audit time |

### Persistence Rules

- Không ghi đè im lặng kết quả AI.
- `verifications` và `claims` giữ giá trị hiện hành để UI đọc nhanh.
- `feedback_events` giữ toàn bộ lịch sử hiệu chỉnh để audit, replay và tinh chỉnh prompt sau MVP.
- `smartbot_feedback` lưu cả phản hồi tích cực/tiêu cực theo từng message hoặc answer id.
- Thông tin provenance cho UI/API được suy ra từ `pipeline_version`, `verification_jobs`, `claim_evidences` và metadata của evidence/provider.

## Indexes

```sql
create index idx_verifications_status_created_at
  on verifications (status, created_at desc);

create index idx_claims_verification_id
  on claims (verification_id);

create index idx_jobs_verification_id
  on verification_jobs (verification_id, status);

create index idx_feedback_verification_id
  on feedback_events (verification_id, created_at desc);

create index idx_evidence_embedding_hnsw
  on evidence_documents
  using hnsw (embedding vector_cosine_ops);
```

## Retrieval Rules

- Query claim embedding against `evidence_documents.embedding`.
- Local search hit nếu similarity `>= 0.75`.
- Nếu miss, gọi Tavily, làm sạch text, rồi upsert lại vào `evidence_documents`.
- MVP ưu tiên một bảng evidence chung thay vì tách knowledge base riêng.
