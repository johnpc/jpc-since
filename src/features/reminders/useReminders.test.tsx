import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CounterRecord } from '../../lib/dataClient';

const sync = vi.hoisted(() => ({ syncReminders: vi.fn() }));
vi.mock('./reminderSync', () => sync);

import { useReminders } from './useReminders';

const counter = (over: Partial<CounterRecord>): CounterRecord =>
  ({ id: 'c1', sinceAt: '2026-06-01T00:00:00Z', reminderDays: 30, ...over }) as CounterRecord;

describe('useReminders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('syncs on mount', () => {
    renderHook(() => useReminders([counter({})]));
    expect(sync.syncReminders).toHaveBeenCalledTimes(1);
  });

  it('does not resync when the reminder signature is unchanged', () => {
    const counters = [counter({})];
    const { rerender } = renderHook(({ c }) => useReminders(c), {
      initialProps: { c: counters },
    });
    rerender({ c: [counter({})] }); // same id/sinceAt/reminderDays
    expect(sync.syncReminders).toHaveBeenCalledTimes(1);
  });

  it('resyncs when sinceAt changes (e.g. after a reset)', () => {
    const { rerender } = renderHook(({ c }) => useReminders(c), {
      initialProps: { c: [counter({})] },
    });
    rerender({ c: [counter({ sinceAt: '2026-06-28T00:00:00Z' })] });
    expect(sync.syncReminders).toHaveBeenCalledTimes(2);
  });
});
