# Since

A "count up" app: it shows **how long it's been SINCE** something last happened — "4 weeks
since haircut", "12 days since the plant was watered" — and lets you reset a counter with a
tap when the event happens again. The inverse of a countdown. Architecture is modeled on
`stoop` (see `README.md`).

## How we work together (read this first)

The person directing you may be **non-technical** — an "idea guy" who owns the **product**.
They define **WHAT**: features, intent, and Gherkin acceptance scenarios. **You own the HOW**:
architecture, code quality, testing, and every technical decision below.

- **Never ask them to make a technical call.** Don't surface coverage numbers, CRAP, lint,
  file-length, library choices, or schema design as questions. Decide them yourself, to the
  standards in this file, silently.
- **Translate vague ideas into Gherkin.** When they describe a feature, propose concrete
  `.feature` scenarios (Given/When/Then) and confirm those — that's the spec you build to.
- **Only escalate genuine _product_ questions** — ambiguous behavior, scope, copy, what a
  screen should do. Those are theirs. Everything technical is yours.

## Workflow: specs-first vertical slices

Every feature ships as one **thin vertical slice** — UI + hook + API + backend model + tests,
just enough for the scenario, nothing speculative.

1. **Spec first.** Write/confirm Gherkin scenarios in `e2e/features/<slice>/*.feature`, steps
   in `e2e/steps/`.
2. **Scaffold backend only as the slice needs it** — add Amplify models in `amplify/` for
   exactly this slice's read patterns.
3. **Implement to pass the spec** — follow the architecture and file conventions below.
4. **Run the full quality gate** (`npm run quality`) and get it green locally.
5. **Deploy** the backend if it changed (`npx ampx sandbox` to dev).
6. **Conventional commit, push, CI green.** Open a PR; CI blocks the merge.

## Stack

- **Client:** Ionic 8 + React 19 + TypeScript (strict), Vite, Capacitor 8 (iOS via Swift
  Package Manager — no CocoaPods; Android).
- **Backend:** AWS Amplify Gen2 — Cognito (email) auth + AppSync (GraphQL) + **DynamoDB**.
  Lives in `amplify/`. Personal app: no ingestion pipeline, storage, or Lambda functions.

## Architecture (the one mental model that matters)

- **Everything is per-user.** A `Counter` is a thing you track the time since; a
  `CounterReset` logs one ended interval. Both are owner-authed and read/written with
  `authMode: 'userPool'` (see ADR [0001](docs/decisions/0001-personal-owner-auth.md)). There
  is no guest path and no public reference data.
- **Streak stats are derived, never stored.** "Longest gap", "average", and "reset count"
  are computed at read time from `CounterReset` rows (ADR
  [0002](docs/decisions/0002-reset-history-model.md)) — no denormalized aggregates to drift.

### Code organization (follow the existing slices)

Features are **vertical slices** under `src/features/<feature>/`, tests colocated. Keep this
shape:

- **`useX.ts`** — hooks hold all logic and orchestration; client state via Context + Hook +
  Provider (`XContext.ts` + `useX.ts` + `XProvider.tsx`, e.g. `auth/`).
- **`xApi.ts`** — all **server state goes through react-query** (`useQuery`/`useMutation`)
  wrapping the Amplify client. No server fetches in components.
- **`X.tsx`** — components **only render**; no business logic, no fetching.
- **`x.ts`** helpers — pure functions for any non-trivial logic, so it's unit-testable and
  stays under the line limit.
- **`X.css`** — consume design tokens only (see Design).

## Design

- **`docs/STYLE_GUIDE.md` is the source of truth for all UI.** Dark-locked. Style only via the
  `--since-*` CSS variables and role classes (`.since-elapsed`, `.since-h1`, …) in
  `src/theme/variables.css` — **never hardcoded hex/px**. The one colorful element is each
  counter's own `hexColor`, applied as the card surface. Fonts: Newsreader (serif) + Inter
  (sans).

## Quality gates (non-negotiable — CI + husky pre-commit enforce them)

Hard gates. **Enforce them yourself without asking** — when one fails, fix the code, never the
gate. `npm run quality` runs the full set (also the pre-commit hook + CI).

**Scope — gates cover both `src/` and `amplify/` LOGIC.** Only declarative files are exempt:
`amplify/**/resource.ts` and `amplify/backend.ts`.

- **No `any`, ever.** ESLint `@typescript-eslint/no-explicit-any: error`.
- **Every `.ts`/`.tsx` logic file ≤ 100 lines** (`npm run check:lines`). Over → extract a
  helper or split. **Never raise the limit.**
- **≥ 80% coverage** (statements/branches/functions/lines) on every logic file. Fix by
  **writing tests** — never by adding exclusions.
- **CRAP ≤ 15 per function** (`npm run crap`).
- **Acceptance tests are always Gherkin** (`.feature` + steps in `e2e/`), via Playwright +
  playwright-bdd. Never raw spec code.
- **Build must pass** (`npm run build` = `tsc` + amplify typecheck + Vite).
- **Format clean** — Prettier (`npm run format:check`).

### Honest e2e: test the authenticated data path, not just navigation

- **Every data-reading flow must be exercised at least once while authenticated**, asserting
  on **rendered real data** (a created counter's title / elapsed string), never just a URL.
- **After signing in, wait for the established Cognito session before reading data.** The
  shared sign-in step waits for the Cognito `accessToken` in `localStorage`; reuse it.
- Scenarios that assert live-backend behavior are tagged `@requires-deploy` and run with
  `RUN_PENDING_DEPLOY=1` (CI sets it). Each creates and deletes its own per-user rows so reruns
  against the one shared test user stay contention-free.

## Definition of done

1. `npm run quality` green locally.
2. Gherkin acceptance scenarios + colocated unit tests added and passing.
3. Backend deployed if any Amplify model changed.
4. Conventional commit, branch pushed, PR open, **CI green**.

## Commands

```bash
npm run dev            # Vite dev server
npm run quality        # full local gate: lint + check:lines + coverage + crap + build
npm run format         # Prettier write (run before committing)
npm run test:coverage  # unit tests + coverage (the 80% floor)
npm run crap           # CRAP analysis (after coverage)
npm run test:e2e       # Gherkin acceptance tests (bddgen + Playwright)
npm run prod-config    # pull amplify_outputs.json from the deployed main backend
npx ampx sandbox       # personal cloud backend sandbox
npx cap sync ios       # sync web build into the iOS project
```

## Key facts

- **iOS bundle id / Android package:** `com.johncorser.since`. Apple **team id `JW5SC3NYUV`**.
  `ITSAppUsesNonExemptEncryption=false`.
- **AWS:** profile `personal`, region `us-west-2`. Amplify app id `d2kzzm3radlcp1` (branch `main`).
- **CI:** `.github/workflows/ci.yml` (quality + Gherkin acceptance) blocks PRs.
  `ios-deploy.yml` archives + uploads to TestFlight; `android-deploy.yml` publishes a debug
  APK to a GitHub Release — both after CI succeeds on `main`.
- `scripts/prod-config.mjs` pulls outputs from app `d2kzzm3radlcp1` branch `main` (override with
  `AMPLIFY_APP_ID`).

## Decisions

Architectural decisions live in `docs/decisions/`. Read them before re-opening a settled
question; add a record when a significant choice is made.
