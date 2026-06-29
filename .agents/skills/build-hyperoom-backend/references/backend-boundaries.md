# Backend boundaries

## Dependency direction

```text
API / worker adapters -> application use cases -> domain
provider / database adapters --------^ through ports
```

The domain must not import FastAPI, SQLAlchemy, HTTP clients, VNPT SDKs, Tavily, model runtimes, or queue libraries.

## Modules

| Module | Owns | Does not own |
| --- | --- | --- |
| ingestion | input normalization, OCR/STT dispatch | claim verdicts |
| verification | orchestration and job lifecycle | provider HTTP details |
| claims | claim/entity schema and extraction rules | evidence search |
| retrieval | local-first routing, provenance, ranking | verdict policy |
| scoring | Trust, Impact, Risk rules | persistence transport |
| editorial | grounded angles and outlines | evidence acquisition |
| feedback | human corrections and audit history | silent score mutation |

## Required seams

- `DocumentDigitizer`
- `ClaimExtractor`
- `EvidenceRepository`
- `OnlineEvidenceSearch`
- `EvidenceReranker`
- `SocialMetricsProvider`
- `VerificationReasoner`
- `EditorialGenerator`
- `VerificationRepository`
- `JobDispatcher`

Names may follow repository conventions, but preserve equivalent seams.

## Contract invariants

- Use stable opaque IDs and timezone-aware timestamps.
- Declare every score range and reject invalid boundary values.
- Attach a URL or internal document ID and retrieval metadata to evidence.
- Return `Uncertain` or `needs_review` when evidence is insufficient.
- Append audit records for human edits; never erase model output.
- Return stable machine-readable error codes and safe messages.

Configure local-search threshold, Top-K/Top-N, trusted domains, source weights, timeouts, retries, model IDs, endpoints, and feature flags.
