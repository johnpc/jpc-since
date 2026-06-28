import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCounter,
  deleteCounter,
  listCounters,
  updateCounter,
  type CounterInput,
} from './countersApi';
import { useAuth } from '../auth/useAuth';

/** The signed-in user's counters + create/update/delete mutations. */
export function useCounters() {
  const { status } = useAuth();
  const enabled = status === 'authenticated';
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['counters'] });

  const query = useQuery({ queryKey: ['counters'], queryFn: listCounters, enabled });

  const create = useMutation({ mutationFn: createCounter, onSuccess: invalidate });
  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<CounterInput> }) =>
      updateCounter(id, patch),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteCounter(id),
    onSuccess: invalidate,
  });

  return {
    counters: query.data ?? [],
    isLoading: enabled && query.isLoading,
    isAuthenticated: enabled,
    createCounter: create.mutateAsync,
    updateCounter: update.mutateAsync,
    deleteCounter: remove.mutateAsync,
  };
}
