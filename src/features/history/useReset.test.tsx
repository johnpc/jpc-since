import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import type { CounterRecord } from '../../lib/dataClient';

const api = vi.hoisted(() => ({ resetCounter: vi.fn() }));
vi.mock('./historyApi', () => api);

import { useReset } from './useReset';

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const counter = { id: 'c1', title: 'Haircut' } as CounterRecord;

describe('useReset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resets via the api and is idle by default', async () => {
    api.resetCounter.mockResolvedValue(undefined);
    const { result } = renderHook(() => useReset(), { wrapper });
    expect(result.current.resettingId).toBeNull();
    await act(async () => {
      await result.current.reset(counter);
    });
    expect(api.resetCounter).toHaveBeenCalledWith(counter);
  });
});
