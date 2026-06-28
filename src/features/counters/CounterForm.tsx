import { COUNTER_COLORS } from './counterFields';
import { useCounterForm } from './useCounterForm';
import { EmojiField } from './EmojiField';
import './counters.css';

/** Create-counter form. Presentational shell over useCounterForm. */
export function CounterForm({ onDone }: { onDone: () => void }) {
  const f = useCounterForm(onDone);

  return (
    <div className="cform">
      <EmojiField value={f.values.emoji} onSelect={(emoji) => f.set('emoji', emoji)} />
      <label className="cform__field">
        <span className="cform__label">Name</span>
        <input
          className="cform__input"
          placeholder="Haircut"
          value={f.values.title}
          onChange={(e) => f.set('title', e.target.value)}
        />
      </label>
      <div className="cform__field">
        <span className="cform__label">Color</span>
        <div className="cform__colors">
          {COUNTER_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`color ${c}`}
              aria-pressed={f.values.hexColor === c}
              className={
                f.values.hexColor === c ? 'cform__swatch cform__swatch--on' : 'cform__swatch'
              }
              style={{ background: c }}
              onClick={() => f.set('hexColor', c)}
            />
          ))}
        </div>
      </div>
      <label className="cform__field">
        <span className="cform__label">Remind me after (days, optional)</span>
        <input
          className="cform__input"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 42"
          value={f.values.reminderDays}
          onChange={(e) => f.set('reminderDays', e.target.value)}
        />
      </label>
      {f.error && <p className="cform__error">{f.error}</p>}
      <button type="button" className="cform__cta" disabled={f.busy} onClick={f.submit}>
        {f.busy ? 'Saving…' : 'Start counting'}
      </button>
    </div>
  );
}
