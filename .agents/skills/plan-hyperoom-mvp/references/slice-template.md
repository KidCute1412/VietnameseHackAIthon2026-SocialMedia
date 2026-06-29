# Vertical slice template

## Decision order

1. User-visible outcome
2. Architecture path and boundaries
3. Contracts and persisted state
4. Happy path
5. Failure and degraded paths
6. Tests and demo evidence
7. Explicit deferrals

## Output

```markdown
## Slice: <outcome>
Architecture path: <ingestion -> processing -> delivery>
Demo: Given <state>, when <action>, then <result>.

### Contracts
- <contract and compatibility rule>
### Tasks
1. <task>
   - Acceptance: <observable behavior>
   - Verify: <command or check>
### Failure behavior
- <failure>: <visible and persisted outcome>
### Deferred
- <item>: <reason>
### Risks
- <risk>: <mitigation or decision deadline>
```

## Priority

1. User input-to-outline with traceable evidence
2. Stable verification API and job lifecycle
3. Trust/risk results with human review
4. Trending ingestion through the same pipeline
5. Real-time updates and provider optimizations

Reject infrastructure-only, UI-only, or isolated-model slices unless they unblock the next end-to-end outcome.
