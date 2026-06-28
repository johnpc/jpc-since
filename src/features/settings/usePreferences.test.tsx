import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { usePreferences } from './usePreferences';

describe('usePreferences', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to oldest and persists an update', () => {
    const { result } = renderHook(() => usePreferences());
    expect(result.current.sort).toBe('oldest');
    act(() => result.current.updateSort('newest'));
    expect(result.current.sort).toBe('newest');
    expect(localStorage.getItem('since.pref.sort')).toBe('newest');
  });
});
