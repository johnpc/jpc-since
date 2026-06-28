# 0002 — Reset history as per-interval rows; streak stats derived at read time

## Status

Accepted.

## Context

Resetting a counter is the count-up-defining action: "I just got a haircut." The product wants
more than a bare reset — it wants **history and streaks** (longest gap, average gap, number of
resets). We had to decide how to store that.

Two options:

1. **Denormalized aggregates** on the `Counter` (e.g. `resetCount`, `longestSeconds`,
   `totalSeconds`), updated on each reset.
2. **One row per reset** (`CounterReset`), with stats derived by reading those rows.

## Decision

Store **one `CounterReset` row per reset** — the interval that just ended:

```
CounterReset { counterId (GSI), startedAt, endedAt, durationSeconds }
```

On reset (`historyApi.resetCounter`): create the `CounterReset` first, then advance the
counter's `sinceAt` to now. Writing history first means a mid-way failure never advances
`sinceAt` without a matching history row.

Streak stats are **pure functions** over the reset list (`streaks.ts`), computed at read time
on the history screen. `durationSeconds` is stored on each row so the stats need no date
re-parsing.

## Consequences

- **No aggregate drift.** There is no `resetCount`/`longestSeconds` to get out of sync with the
  underlying rows — the rows _are_ the source of truth.
- **Cheap reads.** A counter's history is a single GSI query by `counterId`; the math is
  in-memory over a small list (resets are low-volume per counter).
- **Richer history for free.** Because every interval is a row, the detail screen can list past
  stretches, not just summary numbers.
- Trade-off: computing stats client-side means we read all of a counter's resets to show them.
  Acceptable at personal scale; if a counter ever had thousands of resets we'd paginate or
  precompute — not a concern for the foreseeable use.
