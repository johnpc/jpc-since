import { Redirect } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './useAuth';
import { useStartRoute } from './useStartRoute';

/**
 * Keeps an already signed-in user off /welcome, /signin, /signup. While auth
 * status is loading we render nothing (no flicker); once authenticated we
 * redirect to the start route; otherwise we render the wrapped auth screen.
 */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const start = useStartRoute();

  if (status === 'loading' || start === 'loading') return null;
  if (status === 'authenticated') return <Redirect to={start} />;
  return <>{children}</>;
}
