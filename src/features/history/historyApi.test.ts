import { describe, it, expect, vi, beforeEach } from 'vitest';

const m = vi.hoisted(() => ({ list: vi.fn(), create: vi.fn() }));
const counters = vi.hoisted(() => ({ updateCounter: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({
  USER_POOL: { authMode: 'userPool' },
  dataClient: { models: { CounterReset: { list: m.list, create: m.create } } },
}));
vi.mock('../counters/countersApi', () => counters);

import { listResets, resetCounter } from './historyApi';
import type { CounterRecord } from '../../lib/dataClient';

const NOW = new Date('2026-06-28T12:00:00Z');
const counter = (sinceAt: string): CounterRecord =>
  ({ id: 'c1', title: 'Haircut', sinceAt }) as CounterRecord;

describe('historyApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listResets filters by counterId with userPool', async () => {
    m.list.mockResolvedValue({ data: [{ id: 'r1' }] });
    const out = await listResets('c1');
    expect(m.list).toHaveBeenCalledWith({
      filter: { counterId: { eq: 'c1' } },
      limit: 500,
      authMode: 'userPool',
    });
    expect(out).toHaveLength(1);
  });

  it('resetCounter logs the interval then advances sinceAt', async () => {
    m.create.mockResolvedValue({ errors: null });
    const startedAt = new Date(NOW.getTime() - 86_400_000).toISOString();
    await resetCounter(counter(startedAt), NOW);
    expect(m.create).toHaveBeenCalledWith(
      { counterId: 'c1', startedAt, endedAt: NOW.toISOString(), durationSeconds: 86_400 },
      { authMode: 'userPool' },
    );
    expect(counters.updateCounter).toHaveBeenCalledWith('c1', { sinceAt: NOW.toISOString() });
  });

  it('resetCounter throws (and does not advance) when logging fails', async () => {
    m.create.mockResolvedValue({ errors: [{ message: 'fail' }] });
    await expect(resetCounter(counter(NOW.toISOString()), NOW)).rejects.toThrow('fail');
    expect(counters.updateCounter).not.toHaveBeenCalled();
  });
});
