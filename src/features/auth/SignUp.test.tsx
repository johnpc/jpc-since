import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const form = vi.hoisted(() => ({
  phase: 'collect' as 'collect' | 'confirm',
  email: 'a@b.com',
  password: '',
  code: '',
  error: null as string | null,
  busy: false,
  setEmail: vi.fn(),
  setPassword: vi.fn(),
  setCode: vi.fn(),
  submitDetails: vi.fn(),
  submitCode: vi.fn(),
}));
vi.mock('./useSignUpForm', () => ({ useSignUpForm: () => form }));

import { SignUp } from './SignUp';

const renderPage = () =>
  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>,
  );

describe('SignUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    form.phase = 'collect';
    form.error = null;
  });

  it('submits details in the collect phase', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    expect(form.submitDetails).toHaveBeenCalled();
  });

  it('confirms the code in the confirm phase', () => {
    form.phase = 'confirm';
    renderPage();
    expect(screen.getByText(/We sent a code/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(form.submitCode).toHaveBeenCalled();
  });
});
