import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { CounterRecord } from '../../lib/dataClient';
import { nextFireAt, notificationId, reminderBody } from './reminders';

/** Local notifications only exist on a native device — no-op on web/CI. */
function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/** Ask for permission once; returns false if denied or unavailable. */
export async function ensurePermission(): Promise<boolean> {
  if (!isNative()) return false;
  const status = await LocalNotifications.checkPermissions();
  if (status.display === 'granted') return true;
  const requested = await LocalNotifications.requestPermissions();
  return requested.display === 'granted';
}

/**
 * Reconcile every counter's reminder with the OS scheduler: cancel all, then
 * (re)schedule the ones that still have a future reminder. Called after any
 * counter create/edit/reset so the schedule always matches current state.
 */
export async function syncReminders(counters: readonly CounterRecord[], now = new Date()) {
  if (!isNative()) return;
  const due = counters
    .map((c) => ({ counter: c, at: nextFireAt(c, now) }))
    .filter((x): x is { counter: CounterRecord; at: Date } => x.at !== null);
  const ids = counters.map((c) => ({ id: notificationId(c.id) }));
  await LocalNotifications.cancel({ notifications: ids });
  if (due.length === 0) return;
  if (!(await ensurePermission())) return;
  await LocalNotifications.schedule({
    notifications: due.map(({ counter, at }) => ({
      id: notificationId(counter.id),
      title: counter.title,
      body: reminderBody(counter),
      schedule: { at },
    })),
  });
}
