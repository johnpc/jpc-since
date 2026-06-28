/**
 * Counter CRUD. Counters are per-user (owner authz), so every call uses
 * authMode 'userPool' — the owner rule scopes rows to the signed-in user.
 */
import { dataClient, USER_POOL, type CounterRecord } from '../../lib/dataClient';

export interface CounterInput {
  emoji: string;
  title: string;
  sinceAt: string;
  hexColor: string;
  reminderDays?: number | null;
}

/** The current user's counters. Sorted client-side, longest-since first. */
export async function listCounters(): Promise<CounterRecord[]> {
  const { data } = await dataClient.models.Counter.list({ limit: 500, ...USER_POOL });
  return [...data].sort((a, b) => (a.sinceAt ?? '').localeCompare(b.sinceAt ?? ''));
}

/** Create a counter for the current user; returns the created row. */
export async function createCounter(input: CounterInput): Promise<CounterRecord> {
  const { data, errors } = await dataClient.models.Counter.create(
    {
      emoji: input.emoji,
      title: input.title,
      sinceAt: input.sinceAt,
      hexColor: input.hexColor,
      reminderDays: input.reminderDays ?? undefined,
    },
    USER_POOL,
  );
  if (errors || !data) throw new Error(errors?.[0]?.message ?? 'Failed to create counter.');
  return data;
}

/** Patch a counter (partial update by id). */
export async function updateCounter(
  id: string,
  patch: Partial<CounterInput>,
): Promise<CounterRecord> {
  const { data, errors } = await dataClient.models.Counter.update({ id, ...patch }, USER_POOL);
  if (errors || !data) throw new Error(errors?.[0]?.message ?? 'Failed to update counter.');
  return data;
}

/** Delete a counter by id. */
export async function deleteCounter(id: string): Promise<void> {
  const { errors } = await dataClient.models.Counter.delete({ id }, USER_POOL);
  if (errors) throw new Error(errors[0]?.message ?? 'Failed to delete counter.');
}
