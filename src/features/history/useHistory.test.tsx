import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import type { CounterRecord } from '../../lib/dataClient';

const api = vi.hoisted(() => ({ listResets: vi.fn() }));
vi.mock('./historyApi', () => api);
const auth = vi.hoisted(() => ({ status: 'authenticated' as string }));
vi.mock('../auth/useAuth', () => ({ useAuth: () => auth }));

import { useCounterHistory } from './useHistory';

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const NOW = new Date('2026-06-28T12:00:00Z');
const counter = { id: 'c1', title: 'Haircut', sinceAt: NOW.toISOString() } as CounterRecord;

describe('useCounterHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.status = 'authenticated';
  });

  it('returns resets + derived streaks for a counter', async () => {
    api.listResets.mockResolvedValue([{ id: 'r1', durationSeconds: 86_400, endedAt: 'x' }]);
    const { result } = renderHook(() => useCounterHistory(counter, NOW), { wrapper });
    await waitFor(() => expect(result.current.resets).toHaveLength(1));
    expect(result.current.streaks?.resetCount).toBe(1);
  });

  it('is null + empty without a counter', () => {
    const { result } = renderHook(() => useCounterHistory(null, NOW), { wrapper });
    expect(result.current.streaks).toBeNull();
    expect(result.current.resets).toEqual([]);
    expect(api.listResets).not.toHaveBeenCalled();
  });
});
