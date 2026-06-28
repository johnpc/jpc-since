import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const replace = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', () => ({ useHistory: () => ({ replace }) }));
const auth = vi.hoisted(() => ({ signIn: vi.fn() }));
vi.mock('./useAuth', () => ({ useAuth: () => auth }));

import { useSignInForm } from './useSignInForm';

describe('useSignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signs in then routes to the gate', async () => {
    auth.signIn.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSignInForm());
    act(() => {
      result.current.setEmail('a@b.com');
      result.current.setPassword('pw');
    });
    await act(async () => {
      await result.current.submit();
    });
    expect(auth.signIn).toHaveBeenCalledWith('a@b.com', 'pw');
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('surfaces an error and stays put', async () => {
    auth.signIn.mockRejectedValue(new Error('bad creds'));
    const { result } = renderHook(() => useSignInForm());
    await act(async () => {
      await result.current.submit();
    });
    expect(result.current.error).toBe('bad creds');
    expect(replace).not.toHaveBeenCalled();
  });
});
