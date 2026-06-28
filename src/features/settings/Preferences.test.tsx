import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const prefs = vi.hoisted(() => ({ sort: 'oldest' as 'oldest' | 'newest', updateSort: vi.fn() }));
vi.mock('./usePreferences', () => ({ usePreferences: () => prefs }));

import { Preferences } from './Preferences';

describe('Preferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prefs.sort = 'oldest';
  });

  it('marks the active option and switches sort', () => {
    render(<Preferences />);
    const oldest = screen.getByRole('button', { name: 'Longest since first' });
    expect(oldest).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Most recent first' }));
    expect(prefs.updateSort).toHaveBeenCalledWith('newest');
  });
});
