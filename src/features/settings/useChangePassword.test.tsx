import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const auth = vi.hoisted(() => ({ changePassword: vi.fn() }));
vi.mock('../auth/useAuth', () => ({ useAuth: () => auth }));

import { useChangePassword } from './useChangePassword';

describe('useChangePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('surfaces a validation error without calling Cognito', async () => {
    const { result } = renderHook(() => useChangePassword());
    await act(async () => {
      await result.current.submit(); // all blank
    });
    expect(result.current.error).toMatch(/current password/i);
    expect(auth.changePassword).not.toHaveBeenCalled();
  });

  it('changes the password, clears fields, and flags done', async () => {
    auth.changePassword.mockResolvedValue(undefined);
    const { result } = renderHook(() => useChangePassword());
    act(() => {
      result.current.setOld('oldpass1');
      result.current.setNew('abcd1234');
      result.current.setConfirm('abcd1234');
    });
    await act(async () => {
      await result.current.submit();
    });
    expect(auth.changePassword).toHaveBeenCalledWith('oldpass1', 'abcd1234');
    expect(result.current.done).toBe(true);
    expect(result.current.newPassword).toBe('');
  });

  it('surfaces a backend error', async () => {
    auth.changePassword.mockRejectedValue(new Error('wrong password'));
    const { result } = renderHook(() => useChangePassword());
    act(() => {
      result.current.setOld('oldpass1');
      result.current.setNew('abcd1234');
      result.current.setConfirm('abcd1234');
    });
    await act(async () => {
      await result.current.submit();
    });
    expect(result.current.error).toBe('wrong password');
  });
});
