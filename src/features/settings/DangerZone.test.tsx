import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const del = vi.hoisted(() => ({
  confirming: false,
  error: null as string | null,
  busy: false,
  arm: vi.fn(),
  cancel: vi.fn(),
  confirm: vi.fn(),
}));
vi.mock('./useDeleteAccount', () => ({ useDeleteAccount: () => del }));

import { DangerZone } from './DangerZone';

describe('DangerZone', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    del.confirming = false;
    del.error = null;
  });

  it('arms the confirmation from the initial button', () => {
    render(<DangerZone />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete account' }));
    expect(del.arm).toHaveBeenCalled();
  });

  it('shows confirm + cancel once armed', () => {
    del.confirming = true;
    render(<DangerZone />);
    fireEvent.click(screen.getByRole('button', { name: 'Yes, delete everything' }));
    expect(del.confirm).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(del.cancel).toHaveBeenCalled();
  });

  it('shows an error', () => {
    del.error = 'failed';
    render(<DangerZone />);
    expect(screen.getByText('failed')).toBeInTheDocument();
  });
});
