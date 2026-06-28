import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CounterRecord } from '../../lib/dataClient';

const params = vi.hoisted(() => ({ id: 'c1' }));
vi.mock('react-router-dom', () => ({
  useParams: () => params,
  // IonBackButton renders fine without a router context in jsdom; stub the
  // routerLink-driven back button to a no-op anchor isn't needed — Ionic
  // tolerates it. We only stub useParams.
}));
const counters = vi.hoisted(() => ({ counters: [] as CounterRecord[] }));
vi.mock('../counters/useCounters', () => ({ useCounters: () => counters }));
const history = vi.hoisted(() => ({
  resets: [],
  streaks: null as unknown,
  isLoading: false,
}));
vi.mock('./useHistory', () => ({ useCounterHistory: () => history }));
vi.mock('./StreakStats', () => ({ StreakStats: () => <div>stats</div> }));
vi.mock('./ResetList', () => ({ ResetList: () => <div>resets</div> }));

import { CounterHistory } from './CounterHistory';

describe('CounterHistory', () => {
  beforeEach(() => {
    counters.counters = [];
    history.streaks = null;
  });

  it('shows a not-found message when the counter is gone', () => {
    render(<CounterHistory />);
    expect(screen.getByText(/no longer exists/)).toBeInTheDocument();
  });

  it('renders stats + resets for an existing counter', () => {
    counters.counters = [
      { id: 'c1', emoji: '💇', title: 'Haircut', sinceAt: 'x' } as CounterRecord,
    ];
    history.streaks = { currentDays: 1, resetCount: 0, longestDays: 0, averageDays: 0 };
    render(<CounterHistory />);
    expect(screen.getByText('stats')).toBeInTheDocument();
    expect(screen.getByText('resets')).toBeInTheDocument();
  });
});
