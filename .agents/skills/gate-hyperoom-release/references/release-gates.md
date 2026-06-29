# Release gates

## Blocking gates

| Gate | Pass condition |
| --- | --- |
| user outcome | selected vertical slice works end to end |
| contract | client/server schemas and status semantics agree |
| provenance | verdicts retain evidence source and rationale |
| failure honesty | provider loss cannot appear as real success |
| security | no exposed secrets or unsafe sensitive-data logging |
| durability | async job state survives request completion and is queryable |
| tests | focused deterministic tests pass offline |

## Architecture gates

- Domain logic has no framework/provider imports.
- Providers and storage are replaceable adapters.
- Local-first retrieval and configured online fallback remain intact.
- Trust, Impact, Risk, and Editorial responsibilities remain separate.
- Human-in-the-loop changes create audit history.
- MVP substitutions retain seams for a durable queue and dedicated vector storage.

## Demo scenarios

1. Text submission reaches a traceable report and outline.
2. Weak local evidence triggers online fallback or a labeled offline substitute.
3. No evidence produces `Uncertain`/review behavior.
4. Provider timeout produces a visible retryable or terminal state.
5. Reload during processing resumes from persisted state.
6. Human correction preserves the original result.

## Verdict

- `ready`: all blocking gates pass; remaining findings are low risk.
- `conditionally ready`: outcome works, but named non-critical constraints remain.
- `not ready`: a blocking gate fails or core evidence is insufficient.
