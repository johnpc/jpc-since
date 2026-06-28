import { useHistory } from 'react-router-dom';
import type { CounterRecord } from '../../lib/dataClient';
import { formatElapsed } from './elapsed';
import './counters.css';

/** A single counter card. Render-only — actions are passed in by the list. */
export function Counter({
  counter,
  now,
  onReset,
  onDelete,
  resetting,
}: {
  counter: CounterRecord;
  now: Date;
  onReset: (counter: CounterRecord) => void;
  onDelete: (counter: CounterRecord) => void;
  resetting: boolean;
}) {
  const history = useHistory();
  return (
    <article
      className="counter"
      data-testid="counter-card"
      data-counter-title={counter.title}
      style={{ background: counter.hexColor }}
    >
      <div className="counter__top">
        <span className="counter__emoji" aria-hidden="true">
          {counter.emoji}
        </span>
        <span className="counter__title">{counter.title}</span>
        <button
          type="button"
          className="counter__delete"
          aria-label={`Delete ${counter.title}`}
          onClick={() => onDelete(counter)}
        >
          ✕
        </button>
      </div>
      {/* The tappable area that opens history — separate from the action
          buttons so they never double-trigger navigation. */}
      <button
        type="button"
        className="counter__open"
        aria-label={`Open ${counter.title} history`}
        onClick={() => history.push(`/counter/${counter.id}`)}
      >
        <span className="counter__elapsed since-elapsed">
          {formatElapsed(counter.sinceAt, now)}
        </span>
        <span className="counter__since since-meta">since {counter.title}</span>
      </button>
      <button
        type="button"
        className="counter__reset"
        disabled={resetting}
        onClick={() => onReset(counter)}
      >
        {resetting ? 'Resetting…' : 'It just happened — reset'}
      </button>
    </article>
  );
}
