import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const auth = vi.hoisted(() => ({ email: 'a@b.com', signOut: vi.fn() }));
vi.mock('../auth/useAuth', () => ({ useAuth: () => auth }));
vi.mock('./Preferences', () => ({ Preferences: () => <div>prefs</div> }));
vi.mock('./ChangePassword', () => ({ ChangePassword: () => <div>change-pw</div> }));
vi.mock('./DangerZone', () => ({ DangerZone: () => <div>danger</div> }));

import { Settings } from './Settings';
import { SUPPORT_EMAIL } from './settingsConfig';

describe('Settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the signed-in email and composes the section cards', () => {
    render(<Settings />);
    expect(screen.getByText('Signed in as a@b.com')).toBeInTheDocument();
    expect(screen.getByText('prefs')).toBeInTheDocument();
    expect(screen.getByText('change-pw')).toBeInTheDocument();
    expect(screen.getByText('danger')).toBeInTheDocument();
  });

  it('signs out and links support', () => {
    render(<Settings />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(auth.signOut).toHaveBeenCalled();
    expect(screen.getByRole('link', { name: SUPPORT_EMAIL })).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:'),
    );
  });
});
