import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const auth = vi.hoisted(() => ({ status: 'unauthenticated' as string }));
vi.mock('./useAuth', () => ({ useAuth: () => auth }));
const start = vi.hoisted(() => ({ value: '/home' as string }));
vi.mock('./useStartRoute', () => ({ useStartRoute: () => start.value }));
const redirect = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', () => ({
  Redirect: (props: { to: string }) => {
    redirect(props.to);
    return null;
  },
}));

import { RedirectIfAuthenticated } from './RedirectIfAuthenticated';

describe('RedirectIfAuthenticated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.status = 'unauthenticated';
    start.value = '/home';
  });

  it('renders children when signed out', () => {
    render(
      <RedirectIfAuthenticated>
        <p>form</p>
      </RedirectIfAuthenticated>,
    );
    expect(screen.getByText('form')).toBeInTheDocument();
  });

  it('redirects to the start route when authenticated', () => {
    auth.status = 'authenticated';
    render(
      <RedirectIfAuthenticated>
        <p>form</p>
      </RedirectIfAuthenticated>,
    );
    expect(redirect).toHaveBeenCalledWith('/home');
  });

  it('renders nothing while loading', () => {
    auth.status = 'loading';
    const { container } = render(
      <RedirectIfAuthenticated>
        <p>form</p>
      </RedirectIfAuthenticated>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
