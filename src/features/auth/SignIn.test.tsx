import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const form = vi.hoisted(() => ({
  email: '',
  password: '',
  error: null as string | null,
  busy: false,
  setEmail: vi.fn(),
  setPassword: vi.fn(),
  submit: vi.fn(),
}));
vi.mock('./useSignInForm', () => ({ useSignInForm: () => form }));

import { SignIn } from './SignIn';

const renderPage = () =>
  render(
    <MemoryRouter>
      <SignIn />
    </MemoryRouter>,
  );

describe('SignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    form.error = null;
    form.busy = false;
  });

  it('submits on click', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(form.submit).toHaveBeenCalled();
  });

  it('shows an error and a busy label', () => {
    form.error = 'bad creds';
    form.busy = true;
    renderPage();
    expect(screen.getByText('bad creds')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Signing in…' })).toBeDisabled();
  });
});
