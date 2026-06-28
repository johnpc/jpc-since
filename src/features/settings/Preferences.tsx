import { usePreferences } from './usePreferences';
import './settings.css';

/** Home-screen sort preference toggle. */
export function Preferences() {
  const { sort, updateSort } = usePreferences();
  const options: { value: 'oldest' | 'newest'; label: string }[] = [
    { value: 'oldest', label: 'Longest since first' },
    { value: 'newest', label: 'Most recent first' },
  ];

  return (
    <section className="settings__card">
      <h2 className="settings__h2 since-headline">Preferences</h2>
      <p className="settings__label since-meta">Sort counters by</p>
      <div className="settings__segmented">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={sort === o.value}
            className={sort === o.value ? 'settings__seg settings__seg--on' : 'settings__seg'}
            onClick={() => updateSort(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </section>
  );
}
