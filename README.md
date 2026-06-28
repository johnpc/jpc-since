# Since

**How long has it been?** Since is a count-**up** app: it tracks the time _since_ something last
happened — "4 weeks since haircut", "12 days since you watered the fern" — and lets you reset a
counter with a tap when the event happens again. Each reset is logged, so every counter builds a
history with streak stats (current, longest, average, reset count).

It's the inverse of a countdown app, and it's built on the same architecture as
[`stoop`](../stoop): Ionic + React + Amplify Gen2, strict CI quality gates, Gherkin-first
end-to-end coverage, and auto-publish to the App Store (TestFlight) and an Android APK.

## Stack

- **Client:** Ionic 8, React 19, TypeScript (strict), Vite, Capacitor 8 (iOS via SPM, Android).
- **Backend:** AWS Amplify Gen2 — Cognito (email) auth + AppSync (GraphQL) + DynamoDB. Purely
  personal: every counter is owner-authed (see `docs/decisions/0001-personal-owner-auth.md`).
- **State:** react-query for all server state; Context + Hook + Provider for client state.
- **Reminders:** optional per-counter local notification ("remind me after N days") via
  `@capacitor/local-notifications`.

## Data model

| Model          | Purpose                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Counter`      | A thing you track the time since — `emoji`, `title`, `sinceAt`, `hexColor`, optional `reminderDays`.                                       |
| `CounterReset` | One ended interval, logged on reset — `startedAt`, `endedAt`, `durationSeconds` (GSI on `counterId`). Streak stats are derived from these. |

## Quality bar (enforced by CI + husky pre-commit)

- No `any`. Every logic file ≤ 100 lines. ≥ 80% coverage. CRAP ≤ 15 per function.
- Acceptance tests are Gherkin (`.feature` + steps), run under Playwright.
- `npm run build` (tsc + amplify typecheck + Vite) must pass; Prettier clean.

```bash
npm install
npm run dev            # local dev server
npm run quality        # the full local gate
npm run test:e2e       # Gherkin acceptance tests
npx ampx sandbox       # personal cloud backend
```

## Layout

```
src/
  features/
    auth/        # email sign-up / sign-in (Cognito), session provider
    counters/    # the home grid: create, list, the elapsed "since" string
    history/     # reset + per-counter history & streak stats
    reminders/   # optional local-notification scheduling
  lib/           # amplify config, data client, react-query client
  theme/         # dark-locked design tokens + fonts
amplify/         # auth + data resources (Amplify Gen2)
e2e/             # Gherkin features + step definitions
docs/decisions/  # architecture decision records
```

See `CLAUDE.md` for how the project is built and the working agreement.
