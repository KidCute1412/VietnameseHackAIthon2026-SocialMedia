---
name: build-hyperoom-frontend
description: Implement or refactor HypeRoom React product flows aligned with docs/architectures/SystemArchitecture.md and stable backend contracts. Use for dashboard, document upload, verification progress, evidence and risk presentation, editorial outlines, trending feeds, human feedback, SmartBot interaction, frontend state, accessibility, and frontend tests.
---

# Build HypeRoom Frontend

## Establish context

1. Read `docs/architectures/SystemArchitecture.md`, affected components, and the relevant API contract.
2. Read [references/frontend-flow.md](references/frontend-flow.md).
3. Preserve the existing visual system unless the task requests redesign.
4. Identify embedded mock data and prevent it from leaking into production paths.

## Build by user flow

1. Define the page state machine before changing components.
2. Put HTTP/WebSocket access behind a small typed service boundary.
3. Normalize API data once; do not spread response-shape knowledge across components.
4. Separate server state, transient UI state, and derived presentation state.
5. Implement loading, empty, partial, stale, retryable-error, terminal-error, and success states.
6. Keep evidence and rationale traceable from verdict to source.
7. Add focused tests for state transitions and critical interactions.

## Product rules

- Return from submission into a visible queued/processing state immediately.
- Recover progress after reload by verification ID.
- Present Trust, Impact, and Risk as distinct, labeled concepts.
- Show uncertain and provider-degraded states honestly.
- Make evidence links identifiable and safe to open.
- Require explicit action for human overrides and preserve the machine result.
- Keep generated editorial content editable and grounded in verified evidence.
- Do not use color alone to convey verdict or risk.

## Maintainability constraints

- Prefer cohesive feature components over large pages or premature generic frameworks.
- Keep shared UI primitives presentation-only.
- Centralize endpoint paths, polling intervals, and feature flags.
- Add a state library only when current React patterns cannot model the flow clearly.
- Preserve responsive layout and keyboard access.

## Verify

Run existing frontend checks and tests. Exercise success, slow processing, no evidence, provider failure, and reload during processing.
