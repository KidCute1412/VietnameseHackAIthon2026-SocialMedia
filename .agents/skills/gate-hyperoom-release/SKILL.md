---
name: gate-hyperoom-release
description: Review and validate HypeRoom changes against docs/architectures/SystemArchitecture.md, MVP acceptance criteria, maintainability, scalability, security, and release readiness. Use for code review, architecture conformance, test planning, pre-demo checks, Docker validation, regression analysis, or deciding whether a feature is ready to merge or demonstrate.
---

# Gate HypeRoom Release

## Review from evidence

1. Read `docs/architectures/SystemArchitecture.md`, requested acceptance criteria, and changed files.
2. Read [references/release-gates.md](references/release-gates.md).
3. Inspect actual behavior and tests; do not infer readiness from plans.
4. Rank findings by user impact and release risk with file and line references.

## Validate in layers

1. Check contract compatibility and domain invariants.
2. Check architecture boundaries and dependency direction.
3. Run the smallest focused checks that can disprove correctness quickly.
4. Run affected unit and integration tests.
5. Exercise the vertical slice, including a degraded provider path.
6. Check deployability and configuration when relevant to the release.

## Enforce critical properties

- Verification output traces to evidence and provider/model metadata.
- Human feedback is auditable and preserves original output.
- External failures terminate or degrade visibly; they never fabricate success.
- Background work is idempotent and exposes durable state.
- Secrets never enter source, logs, client bundles, or fixtures.
- Logs avoid raw sensitive documents and credentials.
- UI distinguishes processing, uncertain, failed, and completed outcomes.
- Tests run without live VNPT/Tavily services unless explicitly opt-in.

## Report

Lead with blockers and high-risk findings. State violated behavior, evidence, impact, and the smallest correction. Report commands, results, residual risks, and a verdict: `ready`, `conditionally ready`, or `not ready`.
