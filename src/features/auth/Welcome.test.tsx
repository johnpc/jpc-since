import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

const push = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', () => ({ useHistory: () => ({ push }) }));

import { Welcome } from './Welcome';

describe('Welcome', () => {
  it('routes to sign-up and sign-in', () => {
    render(<Welcome />);
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(push).toHaveBeenCalledWith('/signup');
    fireEvent.click(screen.getByText('Sign in'));
    expect(push).toHaveBeenCalledWith('/signin');
  });
});
