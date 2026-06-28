import { formatDistanceStrict } from 'date-fns';
import type { CounterResetRecord } from '../../lib/dataClient';
import './history.css';

/** Render-only list of past intervals (one row per reset). */
export function ResetList({ resets }: { resets: readonly CounterResetRecord[] }) {
  if (resets.length === 0) {
    return <p className="history__empty since-meta">No resets yet — this is the first stretch.</p>;
  }
  return (
    <ul className="resets">
      {resets.map((r) => (
        <li className="resets__row" key={r.id}>
          <span className="resets__span since-label">
            {formatDistanceStrict(0, r.durationSeconds * 1000, { roundingMethod: 'floor' })}
          </span>
          <span className="resets__when since-meta">
            ended {new Date(r.endedAt).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
}
