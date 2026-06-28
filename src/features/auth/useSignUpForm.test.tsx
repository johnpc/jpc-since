import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const replace = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', () => ({ useHistory: () => ({ replace }) }));
const auth = vi.hoisted(() => ({ signUp: vi.fn(), confirmSignUp: vi.fn(), signIn: vi.fn() }));
vi.mock('./useAuth', () => ({ useAuth: () => auth }));

import { useSignUpForm } from './useSignUpForm';

describe('useSignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('moves to the confirm phase when Cognito needs a code', async () => {
    auth.signUp.mockResolvedValue({ needsConfirmation: true });
    const { result } = renderHook(() => useSignUpForm());
    act(() => result.current.setEmail('a@b.com'));
    await act(async () => {
      await result.current.submitDetails();
    });
    expect(result.current.phase).toBe('confirm');
    expect(replace).not.toHaveBeenCalled();
  });

  it('signs in immediately when no confirmation is needed', async () => {
    auth.signUp.mockResolvedValue({ needsConfirmation: false });
    auth.signIn.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSignUpForm());
    await act(async () => {
      await result.current.submitDetails();
    });
    expect(auth.signIn).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('confirms the code then signs in', async () => {
    auth.confirmSignUp.mockResolvedValue(undefined);
    auth.signIn.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSignUpForm());
    act(() => result.current.setCode('123456'));
    await act(async () => {
      await result.current.submitCode();
    });
    expect(auth.confirmSignUp).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('surfaces a sign-up error', async () => {
    auth.signUp.mockRejectedValue(new Error('taken'));
    const { result } = renderHook(() => useSignUpForm());
    await act(async () => {
      await result.current.submitDetails();
    });
    expect(result.current.error).toBe('taken');
  });
});
