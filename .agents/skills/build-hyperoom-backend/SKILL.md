---
name: build-hyperoom-backend
description: Implement or refactor HypeRoom backend, RAG, ingestion, scoring, persistence, background-job, and external-provider code in alignment with docs/architectures/SystemArchitecture.md. Use for FastAPI endpoints, claim extraction, evidence retrieval, Trust/Impact/Risk engines, editorial generation, VNPT or Tavily integrations, database work, workers, and backend tests.
---

# Build HypeRoom Backend

## Establish constraints

1. Read `docs/architectures/SystemArchitecture.md` and the affected code.
2. Read [references/backend-boundaries.md](references/backend-boundaries.md).
3. Inspect relevant POCs for learned behavior, but do not copy POC structure into production blindly.
4. Preserve existing API behavior unless the task explicitly changes the contract.

## Implement from the domain outward

1. Define typed domain models and state transitions.
2. Implement deterministic domain services without network, framework, or database imports.
3. Define provider and repository ports at the application boundary.
4. Implement adapters for FastAPI, storage, VNPT APIs, Tavily, scraping, models, and LLM calls.
5. Wire dependencies in one composition root; do not construct clients inside domain services.
6. Add tests at the cheapest reliable layer, then exercise the affected API path.

## Preserve pipeline semantics

- Model verification as an idempotent job: `queued -> processing -> completed|failed|needs_review`.
- Persist claim, evidence source, retrieval score, model/provider version, rationale, and timestamps.
- Search trusted local knowledge first; retrieve online only below the configured relevance threshold.
- Validate LLM schemas, score bounds, citations, and missing fields.
- Apply timeouts, bounded retries with backoff, and structured errors to external calls.
- Keep mock and real adapters contract-equivalent and expose fallback status in metadata.
- Never hide an unavailable provider by returning fabricated production data.

## Optimize for MVP and scale

- Start with a modular monolith; create code boundaries before deployment boundaries.
- Allow pgvector only through a vector-store port compatible with later Qdrant/Milvus adapters.
- Allow in-process jobs only behind a dispatcher port compatible with a later durable queue.
- Lazy-load and share large models per process.
- Make webhook and worker handlers idempotent with stable job/provider task IDs.
- Configure thresholds, trusted domains, model names, timeouts, and provider selection.

## Verify

Run focused unit tests, affected integration tests with providers mocked, and a contract smoke test. Report untested external behavior explicitly.
