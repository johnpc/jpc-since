import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const replace = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', () => ({ useHistory: () => ({ replace }) }));
const auth = vi.hoisted(() => ({ deleteAccount: vi.fn() }));
vi.mock('../auth/useAuth', () => ({ useAuth: () => auth }));

import { useDeleteAccount } from './useDeleteAccount';

describe('useDeleteAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('arms and cancels the confirmation', () => {
    const { result } = renderHook(() => useDeleteAccount());
    expect(result.current.confirming).toBe(false);
    act(() => result.current.arm());
    expect(result.current.confirming).toBe(true);
    act(() => result.current.cancel());
    expect(result.current.confirming).toBe(false);
  });

  it('deletes then routes to welcome', async () => {
    auth.deleteAccount.mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteAccount());
    await act(async () => {
      await result.current.confirm();
    });
    expect(auth.deleteAccount).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith('/welcome');
  });

  it('surfaces an error and disarms on failure', async () => {
    auth.deleteAccount.mockRejectedValue(new Error('nope'));
    const { result } = renderHook(() => useDeleteAccount());
    act(() => result.current.arm());
    await act(async () => {
      await result.current.confirm();
    });
    expect(result.current.error).toBe('nope');
    expect(result.current.confirming).toBe(false);
    expect(replace).not.toHaveBeenCalled();
  });
});
