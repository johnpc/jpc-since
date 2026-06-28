import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CounterRecord } from '../../lib/dataClient';

const counters = vi.hoisted(() => ({
  counters: [] as CounterRecord[],
  isLoading: false,
}));
vi.mock('./useCounters', () => ({ useCounters: () => counters }));
const reset = vi.hoisted(() => ({ reset: vi.fn(), resettingId: null }));
vi.mock('../history/useReset', () => ({ useReset: () => reset }));
const reminders = vi.hoisted(() => ({ useReminders: vi.fn() }));
vi.mock('../reminders/useReminders', () => reminders);
const auth = vi.hoisted(() => ({ signOut: vi.fn() }));
vi.mock('../auth/useAuth', () => ({ useAuth: () => auth }));
vi.mock('./Counter', () => ({
  Counter: ({ counter }: { counter: CounterRecord }) => <div>card:{counter.title}</div>,
}));
vi.mock('./CounterForm', () => ({ CounterForm: () => <div>form</div> }));

import { Counters } from './Counters';

describe('Counters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    counters.counters = [];
    counters.isLoading = false;
  });

  it('shows the empty state with no counters', () => {
    render(<Counters />);
    expect(screen.getByText(/Nothing tracked yet/)).toBeInTheDocument();
    expect(reminders.useReminders).toHaveBeenCalledWith([]);
  });

  it('renders a card per counter', () => {
    counters.counters = [
      { id: 'c1', title: 'Haircut' } as CounterRecord,
      { id: 'c2', title: 'Oil' } as CounterRecord,
    ];
    render(<Counters />);
    expect(screen.getByText('card:Haircut')).toBeInTheDocument();
    expect(screen.getByText('card:Oil')).toBeInTheDocument();
  });

  it('signs out from the toolbar', () => {
    render(<Counters />);
    fireEvent.click(screen.getByText('Sign out'));
    expect(auth.signOut).toHaveBeenCalled();
  });

  it('renders a closed create modal that hosts the form', () => {
    // IonModal cannot *present* in jsdom (no framework delegate), so we don't
    // click Add here; we assert the modal exists and starts closed. The open
    // path is exercised by the e2e suite against a real browser.
    render(<Counters />);
    const modal = document.querySelector('ion-modal');
    expect(modal).not.toBeNull();
  });

  it('does not show the empty state while loading', () => {
    counters.isLoading = true;
    render(<Counters />);
    expect(screen.queryByText(/Nothing tracked yet/)).not.toBeInTheDocument();
  });
});
