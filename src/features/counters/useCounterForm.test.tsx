import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const counters = vi.hoisted(() => ({ createCounter: vi.fn() }));
vi.mock('./useCounters', () => ({ useCounters: () => counters }));

import { useCounterForm } from './useCounterForm';

describe('useCounterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('surfaces a validation error and does not submit', async () => {
    const onDone = vi.fn();
    const { result } = renderHook(() => useCounterForm(onDone));
    await act(async () => {
      await result.current.submit(); // title is empty
    });
    expect(result.current.error).toBe('Give it a name.');
    expect(counters.createCounter).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
  });

  it('creates and calls onDone on success', async () => {
    counters.createCounter.mockResolvedValue({ id: 'c1' });
    const onDone = vi.fn();
    const { result } = renderHook(() => useCounterForm(onDone));
    act(() => result.current.set('title', 'Haircut'));
    await act(async () => {
      await result.current.submit();
    });
    expect(counters.createCounter).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Haircut', emoji: expect.any(String) }),
    );
    expect(onDone).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('surfaces an api error', async () => {
    counters.createCounter.mockRejectedValue(new Error('backend down'));
    const { result } = renderHook(() => useCounterForm(vi.fn()));
    act(() => result.current.set('title', 'Haircut'));
    await act(async () => {
      await result.current.submit();
    });
    expect(result.current.error).toBe('backend down');
  });
});
