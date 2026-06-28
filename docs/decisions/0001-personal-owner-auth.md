# 0001 — Personal app: single-mode owner auth (no guest path)

## Status

Accepted.

## Context

`Since` is a purely personal app: every counter and every reset belongs to exactly one user.
There is no shared/editorial content and no public reference data to browse signed-out.

The reference app `stoop` runs a **dual** auth model — guest (`identityPool`) reads for
signed-out browsing AND authenticated reads — and paid for it with a whole class of subtle
bugs (its ADR 0004: guest-only rules silently returning empty results once a user signs in).

## Decision

Use a **single** authorization mode everywhere:

- `defineData({ authorizationModes: { defaultAuthorizationMode: 'userPool' } })`.
- Every model: `.authorization((allow) => [allow.owner()])`.
- The data client is created with `authMode: 'userPool'` and every `models.*` call passes the
  shared `USER_POOL` option (`src/lib/dataClient.ts`).

There is **no** `identityPool` / guest path and **no** Cognito group (`auth/resource.ts` has no
`groups`) — there is no editorial role.

## Consequences

- The app requires sign-in before any data screen — acceptable, since there's nothing useful to
  show an anonymous user.
- We entirely sidestep the provider-mismatch failure mode that bit `stoop`: there is only one
  provider, so client mode and schema rule can never disagree.
- If a future feature ever needs shared/public data (e.g. a curated suggestion catalog), that
  will be a deliberate new decision recorded here — not an accidental second auth mode.
