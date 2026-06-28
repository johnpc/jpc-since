import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { useAuth } from './useAuth';
import type { AuthContextValue } from './types';

describe('useAuth', () => {
  it('throws outside a provider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('within an AuthProvider');
  });

  it('returns the context value inside a provider', () => {
    const value = { status: 'authenticated', email: 'a@b.com' } as AuthContextValue;
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.email).toBe('a@b.com');
  });
});
