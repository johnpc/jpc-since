import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const client = vi.hoisted(() => ({
  currentEmail: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
  signOut: vi.fn(),
  updatePassword: vi.fn(),
  deleteAccount: vi.fn(),
}));
vi.mock('./authClient', () => client);

import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

function Probe() {
  const { status, email, signIn, signOut, changePassword, deleteAccount } = useAuth();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="email">{email ?? '-'}</span>
      <button onClick={() => signIn('a@b.com', 'pw')}>in</button>
      <button onClick={() => signOut()}>out</button>
      <button onClick={() => changePassword('old', 'new')}>chpw</button>
      <button onClick={() => deleteAccount()}>del</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves to authenticated when a session exists', async () => {
    client.currentEmail.mockResolvedValue('a@b.com');
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('authenticated'));
    expect(screen.getByTestId('email')).toHaveTextContent('a@b.com');
  });

  it('resolves to unauthenticated with no session', async () => {
    client.currentEmail.mockResolvedValue(null);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated'));
  });

  it('signIn refreshes session, signOut clears it', async () => {
    client.currentEmail.mockResolvedValueOnce(null).mockResolvedValue('a@b.com');
    client.signIn.mockResolvedValue(undefined);
    client.signOut.mockResolvedValue(undefined);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated'));
    await act(async () => screen.getByText('in').click());
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('authenticated'));
    await act(async () => screen.getByText('out').click());
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated'));
  });

  it('changePassword delegates to the client', async () => {
    client.currentEmail.mockResolvedValue('a@b.com');
    client.updatePassword.mockResolvedValue(undefined);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await act(async () => screen.getByText('chpw').click());
    expect(client.updatePassword).toHaveBeenCalledWith('old', 'new');
  });

  it('deleteAccount clears the session', async () => {
    client.currentEmail.mockResolvedValue('a@b.com');
    client.deleteAccount.mockResolvedValue(undefined);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('authenticated'));
    await act(async () => screen.getByText('del').click());
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated'));
    expect(client.deleteAccount).toHaveBeenCalled();
  });
});
