import { describe, it, expect } from 'vitest';
import { nextFireAt, notificationId, reminderBody } from './reminders';
import type { CounterRecord } from '../../lib/dataClient';

const NOW = new Date('2026-06-28T12:00:00Z');
const DAY = 86_400_000;
const counter = (over: Partial<CounterRecord>): CounterRecord =>
  ({
    id: 'c1',
    title: 'Haircut',
    emoji: '💇',
    hexColor: '#abc',
    sinceAt: NOW.toISOString(),
    reminderDays: null,
    ...over,
  }) as CounterRecord;

describe('notificationId', () => {
  it('is stable, positive, and id-derived', () => {
    const a = notificationId('c1');
    expect(a).toBe(notificationId('c1'));
    expect(a).toBeGreaterThan(0);
    expect(notificationId('c2')).not.toBe(a);
  });
});

describe('nextFireAt', () => {
  it('returns null with no reminder', () => {
    expect(nextFireAt(counter({ reminderDays: null }), NOW)).toBeNull();
    expect(nextFireAt(counter({ reminderDays: 0 }), NOW)).toBeNull();
  });

  it('fires at sinceAt + reminderDays', () => {
    const sinceAt = new Date(NOW.getTime() - DAY).toISOString(); // 1 day ago
    const at = nextFireAt(counter({ sinceAt, reminderDays: 30 }), NOW);
    expect(at?.getTime()).toBe(new Date(sinceAt).getTime() + 30 * DAY);
  });

  it('fires shortly when the threshold is already past', () => {
    const sinceAt = new Date(NOW.getTime() - 100 * DAY).toISOString();
    const at = nextFireAt(counter({ sinceAt, reminderDays: 30 }), NOW);
    expect(at?.getTime()).toBe(NOW.getTime() + 1000);
  });
});

describe('reminderBody', () => {
  it('reads naturally', () => {
    expect(reminderBody(counter({ reminderDays: 42 }))).toBe("It's been 42 days since Haircut.");
  });
});
