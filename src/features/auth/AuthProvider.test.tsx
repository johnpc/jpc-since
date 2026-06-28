import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const client = vi.hoisted(() => ({
  currentEmail: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock('./authClient', () => client);

import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

function Probe() {
  const { status, email, signIn, signOut } = useAuth();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="email">{email ?? '-'}</span>
      <button onClick={() => signIn('a@b.com', 'pw')}>in</button>
      <button onClick={() => signOut()}>out</button>
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
});
