import { describe, it, expect } from 'vitest';
import { daysElapsed, elapsedSince, formatElapsed } from './elapsed';

const NOW = new Date('2026-06-28T12:00:00Z');
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();
const DAY = 86_400_000;

describe('formatElapsed', () => {
  it('floors to whole units', () => {
    expect(formatElapsed(ago(28 * DAY), NOW)).toBe('28 days');
    expect(formatElapsed(ago(3 * DAY), NOW)).toBe('3 days');
    expect(formatElapsed(ago(400 * DAY), NOW)).toBe('1 year');
  });

  it('reads future or same-instant dates as "just now"', () => {
    expect(formatElapsed(NOW.toISOString(), NOW)).toBe('just now');
    expect(formatElapsed(ago(-DAY), NOW)).toBe('just now');
  });
});

describe('elapsedSince', () => {
  it('frames the elapsed time with the title', () => {
    expect(elapsedSince('Haircut', ago(28 * DAY), NOW)).toBe('28 days since Haircut');
  });
});

describe('daysElapsed', () => {
  it('counts whole days, clamped at 0', () => {
    expect(daysElapsed(ago(3 * DAY + 5000), NOW)).toBe(3);
    expect(daysElapsed(NOW.toISOString(), NOW)).toBe(0);
    expect(daysElapsed(ago(-DAY), NOW)).toBe(0);
  });
});
