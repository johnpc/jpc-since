import { useEffect } from 'react';
import { syncReminders } from './reminderSync';
import type { CounterRecord } from '../../lib/dataClient';

/**
 * Keep OS-scheduled reminders in sync with the current counters. Re-runs
 * whenever the set of counters or their reminder thresholds / sinceAt change
 * (covering create, edit, and reset). No-ops on web — syncReminders guards the
 * platform internally.
 */
export function useReminders(counters: readonly CounterRecord[]): void {
  // Key on the fields that affect scheduling so we don't reschedule on every
  // render, only when something reminder-relevant actually changed.
  const signature = counters.map((c) => `${c.id}:${c.sinceAt}:${c.reminderDays ?? ''}`).join('|');

  useEffect(() => {
    void syncReminders(counters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);
}
