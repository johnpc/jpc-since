import type { CounterInput } from './countersApi';

/** A small palette of card colors offered in the form. */
export const COUNTER_COLORS = [
  '#7c3aed',
  '#2563eb',
  '#0891b2',
  '#059669',
  '#d97706',
  '#dc2626',
  '#db2777',
  '#475569',
];

export const DEFAULT_EMOJI = '⏱️';

export interface CounterFormValues {
  emoji: string;
  title: string;
  hexColor: string;
  /** Empty string = no reminder; otherwise the number of days as text. */
  reminderDays: string;
}

/** Initial form values — for a new counter, or seeded from an existing one. */
export function initialFormValues(seed?: Partial<CounterFormValues>): CounterFormValues {
  return {
    emoji: seed?.emoji ?? DEFAULT_EMOJI,
    title: seed?.title ?? '',
    hexColor: seed?.hexColor ?? COUNTER_COLORS[0],
    reminderDays: seed?.reminderDays ?? '',
  };
}

/** Parse the optional reminder field: blank/invalid/≤0 → null (no reminder). */
export function parseReminderDays(raw: string): number | null {
  const n = Number(raw.trim());
  if (!raw.trim() || !Number.isFinite(n) || n <= 0) return null;
  return Math.floor(n);
}

/**
 * Validate + normalize form values into a CounterInput. `now` is the event
 * time stamped at creation (a brand-new counter starts counting from now).
 * Returns an error string when invalid.
 */
export function toCounterInput(
  values: CounterFormValues,
  now: Date,
): { input: CounterInput } | { error: string } {
  const title = values.title.trim();
  if (!title) return { error: 'Give it a name.' };
  if (!values.emoji.trim()) return { error: 'Pick an emoji.' };
  return {
    input: {
      emoji: values.emoji,
      title,
      hexColor: values.hexColor,
      sinceAt: now.toISOString(),
      reminderDays: parseReminderDays(values.reminderDays),
    },
  };
}
