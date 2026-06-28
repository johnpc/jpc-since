import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetCounter } from './historyApi';
import type { CounterRecord } from '../../lib/dataClient';

/** Reset mutation — logs the ended interval and advances the counter to now. */
export function useReset() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (counter: CounterRecord) => resetCounter(counter),
    onSuccess: (_data, counter) => {
      void qc.invalidateQueries({ queryKey: ['counters'] });
      void qc.invalidateQueries({ queryKey: ['history', counter.id] });
    },
  });
  return {
    reset: mutation.mutateAsync,
    resettingId: mutation.isPending ? (mutation.variables?.id ?? null) : null,
  };
}
