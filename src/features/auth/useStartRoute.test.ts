import { describe, it, expect } from 'vitest';
import { resolveStartRoute } from './useStartRoute';

describe('resolveStartRoute', () => {
  it('waits while loading', () => {
    expect(resolveStartRoute('loading')).toBe('loading');
  });
  it('sends signed-out users to welcome', () => {
    expect(resolveStartRoute('unauthenticated')).toBe('/welcome');
  });
  it('sends signed-in users home', () => {
    expect(resolveStartRoute('authenticated')).toBe('/home');
  });
});
