import { useEffect, useState } from 'react';

/**
 * A `Date` that updates on an interval so elapsed ("since") figures tick live
 * instead of freezing at the value computed on mount. Default cadence is 1s
 * (smooth for fresh "just now"/seconds counters); callers can widen it.
 */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
