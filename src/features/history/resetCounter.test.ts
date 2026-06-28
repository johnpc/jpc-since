import { describe, it, expect } from 'vitest';
import { planReset } from './resetCounter';
import type { CounterRecord } from '../../lib/dataClient';

const NOW = new Date('2026-06-28T12:00:00Z');
const counter = (sinceAt: string): CounterRecord =>
  ({ id: 'c1', title: 'Haircut', emoji: '💇', hexColor: '#abc', sinceAt }) as CounterRecord;

describe('planReset', () => {
  it('logs the ended interval and advances sinceAt to now', () => {
    const startedAt = new Date(NOW.getTime() - 3 * 86_400_000).toISOString();
    const plan = planReset(counter(startedAt), NOW);
    expect(plan.reset).toEqual({
      counterId: 'c1',
      startedAt,
      endedAt: NOW.toISOString(),
      durationSeconds: 3 * 86_400,
    });
    expect(plan.newSinceAt).toBe(NOW.toISOString());
  });

  it('clamps a future sinceAt to a non-negative duration', () => {
    const future = new Date(NOW.getTime() + 5000).toISOString();
    const plan = planReset(counter(future), NOW);
    expect(plan.reset.durationSeconds).toBe(0);
  });
});
