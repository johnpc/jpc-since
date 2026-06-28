import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Since data schema — a purely personal "count up" app.
 *
 * - Counter: a thing the user tracks the time SINCE (haircut, oil change…).
 *   `sinceAt` is the moment of the last occurrence; the UI counts UP from it.
 * - CounterReset: one row per reset — the interval that just ENDED. Streak
 *   stats (longest gap, average, count) are DERIVED from these rows at read
 *   time, so there are no denormalized aggregates to drift
 *   (docs/decisions/0002-reset-history-model.md).
 *
 * Auth: everything is per-user, so every model uses owner-based authz and the
 * client always reads/writes with authMode 'userPool'. There is no guest /
 * identityPool path — no public reference data exists
 * (docs/decisions/0001-personal-owner-auth.md).
 */
const schema = a.schema({
  Counter: a
    .model({
      emoji: a.string().required(),
      title: a.string().required(), // e.g. "Haircut"
      // The moment of the last occurrence — what the UI counts UP from. A reset
      // sets this to "now"; the previous value is logged as a CounterReset.
      sinceAt: a.datetime().required(),
      hexColor: a.string().required(), // card surface color (the colorful element)
      // Optional nudge: remind me once it's been this many days since sinceAt.
      // null = no reminder. Drives a local notification (reminders slice).
      reminderDays: a.integer(),
      sortOrder: a.integer().default(0),
    })
    .authorization((allow) => [allow.owner()]),

  // One row per reset — the interval that just ended. durationSeconds is stored
  // (endedAt - startedAt) so streak stats need no date re-parsing at read time.
  CounterReset: a
    .model({
      counterId: a.id().required(),
      startedAt: a.datetime().required(), // the sinceAt in effect before this reset
      endedAt: a.datetime().required(), // when the user tapped reset (= new sinceAt)
      durationSeconds: a.integer().required(),
    })
    // List one counter's history, newest-first sort done client-side.
    .secondaryIndexes((index) => [index('counterId')])
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
