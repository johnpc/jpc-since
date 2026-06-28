import type { CounterRecord } from '../../lib/dataClient';

/**
 * Pure reminder scheduling math. A counter with `reminderDays = N` should nudge
 * the user once it's been N days since `sinceAt` — i.e. at `sinceAt + N days`.
 */

const MS_PER_DAY = 86_400_000;

/** The local-notification id for a counter (stable, derived from its id). */
export function notificationId(counterId: string): number {
  let hash = 0;
  for (const ch of counterId) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  // LocalNotifications ids must be positive 32-bit ints.
  return Math.abs(hash) || 1;
}

/** When the reminder should fire, or null if this counter has no reminder. */
export function nextFireAt(counter: CounterRecord, now: Date): Date | null {
  if (!counter.reminderDays || counter.reminderDays <= 0) return null;
  const fireMs = new Date(counter.sinceAt).getTime() + counter.reminderDays * MS_PER_DAY;
  // If the threshold is already past (e.g. an old counter), fire shortly.
  return new Date(Math.max(fireMs, now.getTime() + 1000));
}

/** The notification body for a counter's reminder. */
export function reminderBody(counter: CounterRecord): string {
  return `It's been ${counter.reminderDays} days since ${counter.title}.`;
}
