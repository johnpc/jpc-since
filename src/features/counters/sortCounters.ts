import type { CounterRecord } from '../../lib/dataClient';
import type { CounterSort } from '../settings/settingsConfig';

/**
 * Order counters for display. 'oldest' (longest-since) first is ascending
 * sinceAt; 'newest' (most-recent reset) first is descending. Pure + total —
 * tolerates a missing sinceAt.
 */
export function sortCounters(
  counters: readonly CounterRecord[],
  sort: CounterSort,
): CounterRecord[] {
  const asc = [...counters].sort((a, b) => (a.sinceAt ?? '').localeCompare(b.sinceAt ?? ''));
  return sort === 'newest' ? asc.reverse() : asc;
}
