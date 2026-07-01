# Frontend flow model

## Verification states

```text
idle -> submitting -> queued -> processing -> completed
                     |          |           -> needs_review
                     |          -> failed
                     -> submit_failed
```

Polling and WebSocket events must converge on the same normalized state. Ignore stale events using server timestamps or versions when available.

## View responsibilities

| View | Required behavior |
| --- | --- |
| submission | validate input, show progress, prevent accidental duplicates |
| history | list persisted jobs and resume navigation |
| report | connect claims to verdicts, evidence, rationale, and risk |
| evidence | show title, source, snippet, score, and link |
| editorial | show editable outlines grounded in selected evidence |
| feedback | record explicit correction, reason, actor, and confirmation |
| trending | submit a trend through the normal verification contract |

## API boundary

Centralize create/list/get/observe verification, submit feedback, list trends, and send SmartBot message. Map transport failures into validation, unauthorized, unavailable, timeout, conflict, and unknown UI errors.

## Accessibility minimum

- Use semantic controls and headings.
- Associate labels and errors with inputs.
- Announce asynchronous status without stealing focus.
- Add text/icon labels to risk colors.
- Keep dialogs, uploads, menus, and evidence links keyboard-operable.
