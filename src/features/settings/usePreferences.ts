import { useState } from 'react';
import { getSortPreference, setSortPreference, type CounterSort } from './settingsConfig';

/** Local UI preferences (persisted to localStorage). */
export function usePreferences() {
  const [sort, setSort] = useState<CounterSort>(() => getSortPreference());

  const updateSort = (next: CounterSort) => {
    setSortPreference(next);
    setSort(next);
  };

  return { sort, updateSort };
}
