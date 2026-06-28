import { describe, it, expect } from 'vitest';
import {
  COUNTER_COLORS,
  DEFAULT_EMOJI,
  initialFormValues,
  parseReminderDays,
  toCounterInput,
} from './counterFields';

const NOW = new Date('2026-06-28T12:00:00Z');

describe('initialFormValues', () => {
  it('defaults a fresh form', () => {
    expect(initialFormValues()).toEqual({
      emoji: DEFAULT_EMOJI,
      title: '',
      hexColor: COUNTER_COLORS[0],
      reminderDays: '',
    });
  });

  it('seeds from an existing counter', () => {
    const v = initialFormValues({ title: 'Haircut', emoji: '💇', hexColor: '#fff' });
    expect(v.title).toBe('Haircut');
    expect(v.emoji).toBe('💇');
    expect(v.hexColor).toBe('#fff');
  });
});

describe('parseReminderDays', () => {
  it('returns null for blank/invalid/non-positive', () => {
    expect(parseReminderDays('')).toBeNull();
    expect(parseReminderDays('  ')).toBeNull();
    expect(parseReminderDays('abc')).toBeNull();
    expect(parseReminderDays('0')).toBeNull();
    expect(parseReminderDays('-5')).toBeNull();
  });

  it('floors a positive number', () => {
    expect(parseReminderDays('42')).toBe(42);
    expect(parseReminderDays('7.9')).toBe(7);
  });
});

describe('toCounterInput', () => {
  it('rejects an empty title', () => {
    const r = toCounterInput(initialFormValues({ title: '  ' }), NOW);
    expect(r).toEqual({ error: 'Give it a name.' });
  });

  it('rejects an empty emoji', () => {
    const r = toCounterInput(initialFormValues({ title: 'X', emoji: ' ' }), NOW);
    expect(r).toEqual({ error: 'Pick an emoji.' });
  });

  it('normalizes into a CounterInput stamped at now', () => {
    const r = toCounterInput(
      { emoji: '💇', title: '  Haircut ', hexColor: '#abc', reminderDays: '30' },
      NOW,
    );
    expect(r).toEqual({
      input: {
        emoji: '💇',
        title: 'Haircut',
        hexColor: '#abc',
        sinceAt: NOW.toISOString(),
        reminderDays: 30,
      },
    });
  });

  it('carries a null reminder when blank', () => {
    const r = toCounterInput(initialFormValues({ title: 'X' }), NOW);
    expect('input' in r && r.input.reminderDays).toBeNull();
  });
});
