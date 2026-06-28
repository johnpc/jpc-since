import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CounterRecord } from '../../lib/dataClient';

const push = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', () => ({ useHistory: () => ({ push }) }));

import { Counter } from './Counter';

const NOW = new Date('2026-06-28T12:00:00Z');
const counter = {
  id: 'c1',
  emoji: '💇',
  title: 'Haircut',
  hexColor: '#abc',
  sinceAt: new Date(NOW.getTime() - 3 * 86_400_000).toISOString(),
} as CounterRecord;

const noop = () => {};

describe('Counter', () => {
  beforeEach(() => {
    push.mockClear();
  });

  it('shows the elapsed figure and the title', () => {
    render(
      <Counter counter={counter} now={NOW} onReset={noop} onDelete={noop} resetting={false} />,
    );
    expect(screen.getByText('3 days')).toBeInTheDocument();
    expect(screen.getByText('Haircut')).toBeInTheDocument();
  });

  it('resets without navigating; opens history via the open button', () => {
    const onReset = vi.fn();
    render(
      <Counter counter={counter} now={NOW} onReset={onReset} onDelete={noop} resetting={false} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(onReset).toHaveBeenCalledWith(counter);
    expect(push).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Open Haircut history' }));
    expect(push).toHaveBeenCalledWith('/counter/c1');
  });

  it('deletes without navigating', () => {
    const onDelete = vi.fn();
    render(
      <Counter counter={counter} now={NOW} onReset={noop} onDelete={onDelete} resetting={false} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete Haircut' }));
    expect(onDelete).toHaveBeenCalledWith(counter);
    expect(push).not.toHaveBeenCalled();
  });

  it('disables the reset button while resetting', () => {
    render(<Counter counter={counter} now={NOW} onReset={noop} onDelete={noop} resetting={true} />);
    expect(screen.getByRole('button', { name: 'Resetting…' })).toBeDisabled();
  });
});
