import { describe, it, expect } from 'vitest';
import { computeStreaks, sortResetsNewestFirst } from './streaks';
import type { CounterResetRecord } from '../../lib/dataClient';

const NOW = new Date('2026-06-28T12:00:00Z');
const DAY = 86_400;
const reset = (over: Partial<CounterResetRecord>): CounterResetRecord =>
  ({
    id: 'r',
    counterId: 'c1',
    startedAt: '2026-01-01T00:00:00Z',
    endedAt: '2026-01-10T00:00:00Z',
    durationSeconds: 9 * DAY,
    ...over,
  }) as CounterResetRecord;

describe('computeStreaks', () => {
  it('returns zeros for completed stats when there are no resets', () => {
    const sinceAt = new Date(NOW.getTime() - 5 * DAY * 1000).toISOString();
    expect(computeStreaks([], sinceAt, NOW)).toEqual({
      currentDays: 5,
      resetCount: 0,
      longestDays: 0,
      averageDays: 0,
    });
  });

  it('treats a missing durationSeconds as zero', () => {
    const resets = [reset({ id: 'a', durationSeconds: undefined as unknown as number })];
    const out = computeStreaks(resets, NOW.toISOString(), NOW);
    expect(out.longestDays).toBe(0);
    expect(out.averageDays).toBe(0);
  });

  it('derives longest + average from stored durations', () => {
    const resets = [
      reset({ id: 'a', durationSeconds: 4 * DAY }),
      reset({ id: 'b', durationSeconds: 10 * DAY }),
    ];
    const sinceAt = new Date(NOW.getTime() - 2 * DAY * 1000).toISOString();
    expect(computeStreaks(resets, sinceAt, NOW)).toEqual({
      currentDays: 2,
      resetCount: 2,
      longestDays: 10,
      averageDays: 7,
    });
  });
});

describe('sortResetsNewestFirst', () => {
  it('orders by endedAt descending', () => {
    const out = sortResetsNewestFirst([
      reset({ id: 'old', endedAt: '2026-01-01T00:00:00Z' }),
      reset({ id: 'new', endedAt: '2026-03-01T00:00:00Z' }),
    ]);
    expect(out.map((r) => r.id)).toEqual(['new', 'old']);
  });

  it('tolerates a missing endedAt', () => {
    const out = sortResetsNewestFirst([
      reset({ id: 'a', endedAt: undefined as unknown as string }),
      reset({ id: 'b', endedAt: '2026-03-01T00:00:00Z' }),
    ]);
    expect(out.map((r) => r.id)).toEqual(['b', 'a']);
  });
});
