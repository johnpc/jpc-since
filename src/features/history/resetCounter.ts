import type { CounterRecord } from '../../lib/dataClient';

export interface ResetPlan {
  /** The CounterReset row to create — the interval that just ended. */
  reset: {
    counterId: string;
    startedAt: string;
    endedAt: string;
    durationSeconds: number;
  };
  /** The new sinceAt to write back to the counter (now). */
  newSinceAt: string;
}

/**
 * Pure: given a counter and the moment of reset (`now`), produce the history
 * row for the interval that just ended plus the counter's new sinceAt. No I/O —
 * the api layer persists both. durationSeconds is clamped at 0 so a clock skew
 * (sinceAt slightly in the future) never logs a negative interval.
 */
export function planReset(counter: CounterRecord, now: Date): ResetPlan {
  const startedAt = counter.sinceAt;
  const endedAt = now.toISOString();
  const seconds = Math.floor((now.getTime() - new Date(startedAt).getTime()) / 1000);
  return {
    reset: {
      counterId: counter.id,
      startedAt,
      endedAt,
      durationSeconds: Math.max(0, seconds),
    },
    newSinceAt: endedAt,
  };
}
