import type { Streaks } from './streaks';
import './history.css';

/** Render-only streak summary for a counter's detail screen. */
export function StreakStats({ streaks }: { streaks: Streaks }) {
  const stats = [
    { label: 'Current', value: `${streaks.currentDays}d` },
    { label: 'Resets', value: String(streaks.resetCount) },
    { label: 'Longest', value: `${streaks.longestDays}d` },
    { label: 'Average', value: `${streaks.averageDays}d` },
  ];
  return (
    <div className="stats">
      {stats.map((s) => (
        <div className="stats__cell" key={s.label}>
          <span className="stats__value since-elapsed">{s.value}</span>
          <span className="stats__label since-meta">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
