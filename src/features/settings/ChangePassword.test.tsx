import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const form = vi.hoisted(() => ({
  oldPassword: '',
  newPassword: '',
  confirm: '',
  error: null as string | null,
  done: false,
  busy: false,
  setOld: vi.fn(),
  setNew: vi.fn(),
  setConfirm: vi.fn(),
  submit: vi.fn(),
}));
vi.mock('./useChangePassword', () => ({ useChangePassword: () => form }));

import { ChangePassword } from './ChangePassword';

describe('ChangePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    form.error = null;
    form.done = false;
    form.busy = false;
  });

  it('submits and edits fields', () => {
    render(<ChangePassword />);
    fireEvent.change(screen.getByPlaceholderText('Current password'), {
      target: { value: 'x' },
    });
    expect(form.setOld).toHaveBeenCalledWith('x');
    fireEvent.click(screen.getByRole('button', { name: 'Update password' }));
    expect(form.submit).toHaveBeenCalled();
  });

  it('shows error and success states', () => {
    form.error = 'bad';
    const { rerender } = render(<ChangePassword />);
    expect(screen.getByText('bad')).toBeInTheDocument();
    form.error = null;
    form.done = true;
    rerender(<ChangePassword />);
    expect(screen.getByText('Password updated.')).toBeInTheDocument();
  });
});
