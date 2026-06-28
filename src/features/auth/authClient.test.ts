import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
  signOut: vi.fn(),
  updatePassword: vi.fn(),
  deleteUser: vi.fn(),
}));
vi.mock('aws-amplify/auth', () => mocks);

import * as authClient from './authClient';

describe('authClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('currentEmail returns loginId when signed in', async () => {
    mocks.getCurrentUser.mockResolvedValue({
      username: 'u1',
      signInDetails: { loginId: 'a@b.com' },
    });
    expect(await authClient.currentEmail()).toBe('a@b.com');
  });

  it('currentEmail falls back to username', async () => {
    mocks.getCurrentUser.mockResolvedValue({ username: 'u1' });
    expect(await authClient.currentEmail()).toBe('u1');
  });

  it('currentEmail returns null when not signed in', async () => {
    mocks.getCurrentUser.mockRejectedValue(new Error('no user'));
    expect(await authClient.currentEmail()).toBeNull();
  });

  it('signIn forwards username/password', async () => {
    await authClient.signIn('a@b.com', 'pw');
    expect(mocks.signIn).toHaveBeenCalledWith({ username: 'a@b.com', password: 'pw' });
  });

  it('signUp reports needsConfirmation from the next step', async () => {
    mocks.signUp.mockResolvedValue({ nextStep: { signUpStep: 'CONFIRM_SIGN_UP' } });
    expect(await authClient.signUp('a@b.com', 'pw')).toEqual({ needsConfirmation: true });
    mocks.signUp.mockResolvedValue({ nextStep: { signUpStep: 'DONE' } });
    expect(await authClient.signUp('a@b.com', 'pw')).toEqual({ needsConfirmation: false });
  });

  it('confirmSignUp and signOut forward to the SDK', async () => {
    await authClient.confirmSignUp('a@b.com', '123456');
    expect(mocks.confirmSignUp).toHaveBeenCalledWith({
      username: 'a@b.com',
      confirmationCode: '123456',
    });
    await authClient.signOut();
    expect(mocks.signOut).toHaveBeenCalled();
  });

  it('updatePassword forwards old + new to the SDK', async () => {
    await authClient.updatePassword('oldpass1', 'newpass2');
    expect(mocks.updatePassword).toHaveBeenCalledWith({
      oldPassword: 'oldpass1',
      newPassword: 'newpass2',
    });
  });

  it('deleteAccount forwards to the SDK deleteUser', async () => {
    await authClient.deleteAccount();
    expect(mocks.deleteUser).toHaveBeenCalled();
  });
});
