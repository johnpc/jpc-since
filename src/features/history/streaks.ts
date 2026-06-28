import type { CounterResetRecord } from '../../lib/dataClient';
import { daysElapsed } from '../counters/elapsed';

export interface Streaks {
  /** Whole days since the current interval began (counter.sinceAt → now). */
  currentDays: number;
  /** Number of times this counter has been reset. */
  resetCount: number;
  /** Longest completed interval, in days (0 when no resets yet). */
  longestDays: number;
  /** Mean completed interval, in days, rounded (0 when no resets yet). */
  averageDays: number;
}

const SECONDS_PER_DAY = 86_400;
const toDays = (seconds: number) => Math.floor(seconds / SECONDS_PER_DAY);

/**
 * Pure: derive streak stats from a counter's reset history + its current
 * sinceAt. Completed-interval stats come from the stored durationSeconds, so no
 * date re-parsing is needed (see docs/decisions/0002-reset-history-model.md).
 */
export function computeStreaks(
  resets: readonly CounterResetRecord[],
  sinceAt: string,
  now: Date,
): Streaks {
  const durations = resets.map((r) => r.durationSeconds ?? 0);
  const longest = durations.length ? Math.max(...durations) : 0;
  const total = durations.reduce((sum, d) => sum + d, 0);
  const average = durations.length ? Math.round(total / durations.length) : 0;
  return {
    currentDays: daysElapsed(sinceAt, now),
    resetCount: resets.length,
    longestDays: toDays(longest),
    averageDays: toDays(average),
  };
}

/** Sort reset rows newest-ended first (for the history list). */
export function sortResetsNewestFirst(resets: readonly CounterResetRecord[]): CounterResetRecord[] {
  return [...resets].sort((a, b) => (b.endedAt ?? '').localeCompare(a.endedAt ?? ''));
}
