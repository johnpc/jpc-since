import { useHistory } from 'react-router-dom';
import type { CounterRecord } from '../../lib/dataClient';
import { formatElapsed } from './elapsed';
import './counters.css';

/** A single counter card. Render-only — actions are passed in by the list. */
export function Counter({
  counter,
  now,
  onReset,
  resetting,
}: {
  counter: CounterRecord;
  now: Date;
  onReset: (counter: CounterRecord) => void;
  resetting: boolean;
}) {
  const history = useHistory();
  return (
    <article
      className="counter"
      data-testid="counter-card"
      data-counter-title={counter.title}
      style={{ background: counter.hexColor }}
      onClick={() => history.push(`/counter/${counter.id}`)}
    >
      <div className="counter__top">
        <span className="counter__emoji" aria-hidden="true">
          {counter.emoji}
        </span>
        <span className="counter__title">{counter.title}</span>
      </div>
      <p className="counter__elapsed since-elapsed">{formatElapsed(counter.sinceAt, now)}</p>
      <p className="counter__since since-meta">since {counter.title}</p>
      <button
        type="button"
        className="counter__reset"
        disabled={resetting}
        onClick={(e) => {
          e.stopPropagation();
          onReset(counter);
        }}
      >
        {resetting ? 'Resetting…' : 'It just happened — reset'}
      </button>
    </article>
  );
}
