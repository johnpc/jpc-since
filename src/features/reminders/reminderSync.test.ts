import { describe, it, expect, vi, beforeEach } from 'vitest';

const cap = vi.hoisted(() => ({ isNativePlatform: vi.fn() }));
const ln = vi.hoisted(() => ({
  checkPermissions: vi.fn(),
  requestPermissions: vi.fn(),
  cancel: vi.fn(),
  schedule: vi.fn(),
}));
vi.mock('@capacitor/core', () => ({ Capacitor: cap }));
vi.mock('@capacitor/local-notifications', () => ({ LocalNotifications: ln }));

import { ensurePermission, syncReminders } from './reminderSync';
import type { CounterRecord } from '../../lib/dataClient';

const NOW = new Date('2026-06-28T12:00:00Z');
const counter = (over: Partial<CounterRecord>): CounterRecord =>
  ({
    id: 'c1',
    title: 'Haircut',
    sinceAt: NOW.toISOString(),
    reminderDays: null,
    ...over,
  }) as CounterRecord;

describe('reminderSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cap.isNativePlatform.mockReturnValue(true);
    ln.checkPermissions.mockResolvedValue({ display: 'granted' });
  });

  it('no-ops entirely on web', async () => {
    cap.isNativePlatform.mockReturnValue(false);
    expect(await ensurePermission()).toBe(false);
    await syncReminders([counter({ reminderDays: 30 })], NOW);
    expect(ln.cancel).not.toHaveBeenCalled();
    expect(ln.schedule).not.toHaveBeenCalled();
  });

  it('requests permission when not yet granted', async () => {
    ln.checkPermissions.mockResolvedValue({ display: 'prompt' });
    ln.requestPermissions.mockResolvedValue({ display: 'granted' });
    expect(await ensurePermission()).toBe(true);
    expect(ln.requestPermissions).toHaveBeenCalled();
  });

  it('cancels existing then schedules counters with a reminder', async () => {
    await syncReminders([counter({ reminderDays: 30 }), counter({ id: 'c2' })], NOW);
    expect(ln.cancel).toHaveBeenCalled();
    expect(ln.schedule).toHaveBeenCalledTimes(1);
    const arg = ln.schedule.mock.calls[0][0];
    expect(arg.notifications).toHaveLength(1);
  });

  it('cancels but does not schedule when nothing has a reminder', async () => {
    await syncReminders([counter({ reminderDays: null })], NOW);
    expect(ln.cancel).toHaveBeenCalled();
    expect(ln.schedule).not.toHaveBeenCalled();
  });
});
