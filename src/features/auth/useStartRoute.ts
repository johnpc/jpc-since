import { useAuth } from './useAuth';

export type StartRoute = 'loading' | '/home' | '/welcome';

/** Pure resolver — the single source of truth for where the app opens. */
export function resolveStartRoute(status: string): StartRoute {
  if (status === 'loading') return 'loading';
  return status === 'authenticated' ? '/home' : '/welcome';
}

/**
 * Resolves the initial route from session state. Used by the root gate and by
 * sign-in (which routes to "/" and lets the gate decide). There is no
 * onboarding step — a signed-in user goes straight to their counters.
 */
export function useStartRoute(): StartRoute {
  const { status } = useAuth();
  return resolveStartRoute(status);
}
