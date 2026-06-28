import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';

const api = vi.hoisted(() => ({
  listCounters: vi.fn(),
  createCounter: vi.fn(),
  updateCounter: vi.fn(),
  deleteCounter: vi.fn(),
}));
vi.mock('./countersApi', () => api);
const auth = vi.hoisted(() => ({ status: 'authenticated' as string }));
vi.mock('../auth/useAuth', () => ({ useAuth: () => auth }));

import { useCounters } from './useCounters';

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useCounters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.status = 'authenticated';
  });

  it('lists counters when authenticated', async () => {
    api.listCounters.mockResolvedValue([{ id: 'c1', title: 'Haircut' }]);
    const { result } = renderHook(() => useCounters(), { wrapper });
    await waitFor(() => expect(result.current.counters).toHaveLength(1));
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('is idle + empty when not authenticated', () => {
    auth.status = 'unauthenticated';
    const { result } = renderHook(() => useCounters(), { wrapper });
    expect(result.current.counters).toEqual([]);
    expect(api.listCounters).not.toHaveBeenCalled();
  });

  it('createCounter delegates to the api', async () => {
    api.listCounters.mockResolvedValue([]);
    api.createCounter.mockResolvedValue({ id: 'c2' });
    const { result } = renderHook(() => useCounters(), { wrapper });
    await act(async () => {
      await result.current.createCounter({
        emoji: '💇',
        title: 'Haircut',
        sinceAt: 'x',
        hexColor: '#abc',
      });
    });
    expect(api.createCounter).toHaveBeenCalled();
  });

  it('deleteCounter delegates to the api', async () => {
    api.listCounters.mockResolvedValue([]);
    api.deleteCounter.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCounters(), { wrapper });
    await act(async () => {
      await result.current.deleteCounter('c1');
    });
    expect(api.deleteCounter).toHaveBeenCalledWith('c1');
  });
});
