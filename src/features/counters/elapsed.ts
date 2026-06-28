import { formatDistanceStrict } from 'date-fns';

/**
 * Pure time-since formatting for a counter. All functions take an explicit
 * `now` so they're deterministic under test (no hidden clock).
 */

/** Whole-unit elapsed string from `sinceAt` to `now`, e.g. "4 weeks", "3 days". */
export function formatElapsed(sinceAt: string, now: Date): string {
  const since = new Date(sinceAt);
  // Future or same-instant dates read as "just now" rather than a negative span.
  if (since.getTime() >= now.getTime()) return 'just now';
  return formatDistanceStrict(since, now, { roundingMethod: 'floor' });
}

/** The headline framing shown under a counter, e.g. "4 weeks since Haircut". */
export function elapsedSince(title: string, sinceAt: string, now: Date): string {
  return `${formatElapsed(sinceAt, now)} since ${title}`;
}

/** Whole days elapsed (used by reminder threshold logic). */
export function daysElapsed(sinceAt: string, now: Date): number {
  const ms = now.getTime() - new Date(sinceAt).getTime();
  if (ms <= 0) return 0;
  return Math.floor(ms / 86_400_000);
}
