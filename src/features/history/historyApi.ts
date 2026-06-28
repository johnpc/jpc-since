/**
 * Reset-history reads/writes. Per-user (owner authz), so every call uses
 * authMode 'userPool'. CounterReset rows are listed by the counterId GSI.
 */
import { dataClient, USER_POOL, type CounterResetRecord } from '../../lib/dataClient';
import { planReset } from './resetCounter';
import { updateCounter } from '../counters/countersApi';
import type { CounterRecord } from '../../lib/dataClient';

/** All reset rows for a counter (newest-first sort done by the caller). */
export async function listResets(counterId: string): Promise<CounterResetRecord[]> {
  const { data } = await dataClient.models.CounterReset.list({
    filter: { counterId: { eq: counterId } },
    limit: 500,
    ...USER_POOL,
  });
  return data;
}

/**
 * Reset a counter: log the interval that just ended (CounterReset), then bump
 * the counter's sinceAt to now. The history row is written first so a failure
 * mid-way never advances sinceAt without a matching history entry.
 */
export async function resetCounter(counter: CounterRecord, now = new Date()): Promise<void> {
  const plan = planReset(counter, now);
  const { errors } = await dataClient.models.CounterReset.create(plan.reset, USER_POOL);
  if (errors) throw new Error(errors[0]?.message ?? 'Failed to log reset.');
  await updateCounter(counter.id, { sinceAt: plan.newSinceAt });
}
