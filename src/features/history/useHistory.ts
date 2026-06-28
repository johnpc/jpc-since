import { useQuery } from '@tanstack/react-query';
import { listResets } from './historyApi';
import { computeStreaks, sortResetsNewestFirst } from './streaks';
import { useAuth } from '../auth/useAuth';
import type { CounterRecord } from '../../lib/dataClient';

/** A counter's reset history + derived streak stats. */
export function useCounterHistory(counter: CounterRecord | null, now: Date) {
  const { status } = useAuth();
  const enabled = status === 'authenticated' && !!counter;
  const query = useQuery({
    queryKey: ['history', counter?.id],
    queryFn: () => listResets(counter!.id),
    enabled,
  });
  const resets = query.data ?? [];
  return {
    resets: sortResetsNewestFirst(resets),
    streaks: counter ? computeStreaks(resets, counter.sinceAt, now) : null,
    isLoading: enabled && query.isLoading,
  };
}
