import { useCallback, useState } from 'react';
import { initialFormValues, toCounterInput, type CounterFormValues } from './counterFields';
import { useCounters } from './useCounters';

/** Form state + submit for creating a counter. Calls onDone after success. */
export function useCounterForm(onDone: () => void) {
  const { createCounter } = useCounters();
  const [values, setValues] = useState<CounterFormValues>(() => initialFormValues());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = useCallback(
    <K extends keyof CounterFormValues>(key: K, value: CounterFormValues[K]) =>
      setValues((v) => ({ ...v, [key]: value })),
    [],
  );

  const submit = useCallback(async () => {
    const result = toCounterInput(values, new Date());
    if ('error' in result) {
      setError(result.error);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await createCounter(result.input);
      setValues(initialFormValues());
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }, [values, createCounter, onDone]);

  return { values, set, error, busy, submit };
}
