---
name: plan-hyperoom-mvp
description: Plan and refine HypeRoom MVP features as small, demonstrable vertical slices aligned with docs/architectures/SystemArchitecture.md. Use when scoping features, sequencing delivery, writing acceptance criteria, resolving MVP tradeoffs, estimating work, or deciding whether a proposed change belongs in the one-week product scope.
---

# Plan HypeRoom MVP

## Establish context

1. Read `docs/architectures/SystemArchitecture.md` as the architectural source of truth.
2. Read only relevant sections of `docs/mvp/MVP_1Week_Build_Plan.md`, `docs/tech.md`, and `docs/features/verifyNews.md`.
3. Inspect the current implementation before proposing files or tasks.
4. State conflicts between documents or code. Preserve architecture boundaries; treat other implementation choices as replaceable adapters.

## Plan a vertical slice

1. Identify the user outcome and architecture workflow it exercises.
2. Select the thinnest end-to-end path demonstrable with real or contract-faithful mock integrations.
3. Define API contracts and persisted state before splitting frontend and backend tasks.
4. Separate domain logic from VNPT, Tavily, model, database, and transport details.
5. Include failure, timeout, retry, and empty-result behavior for each external dependency.
6. Give every task an observable acceptance criterion and verification command or manual check.
7. Defer capabilities that do not prove the selected outcome.

Use [references/slice-template.md](references/slice-template.md) for output structure and prioritization.

## Apply MVP constraints

- Prefer a modular monolith and background jobs over independently deployed microservices.
- Keep provider integrations behind ports so mocks and production clients share contracts.
- Preserve asynchronous job semantics even if the MVP uses an in-process worker.
- Prefer one authoritative data model and idempotent job transitions.
- Require source provenance, evidence citations, and human-review state.
- Label demo-safe fallbacks explicitly; do not describe mocked dependencies as production-ready.

## Finish

Return the ordered slice plan, contracts affected, acceptance criteria, deferred work, and top risks. Keep tasks independently reviewable and sized for hours rather than days.
