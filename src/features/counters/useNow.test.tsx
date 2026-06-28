import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useNow } from './useNow';

describe('useNow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('advances on the interval so elapsed figures tick live', () => {
    const { result } = renderHook(() => useNow(1000));
    const first = result.current.getTime();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.getTime()).toBeGreaterThanOrEqual(first + 3000);
  });

  it('clears its interval on unmount', () => {
    const clear = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = renderHook(() => useNow());
    unmount();
    expect(clear).toHaveBeenCalled();
  });
});
