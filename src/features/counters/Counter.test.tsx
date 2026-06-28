import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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

describe('Counter', () => {
  it('shows the elapsed figure and the title', () => {
    render(<Counter counter={counter} now={NOW} onReset={vi.fn()} resetting={false} />);
    expect(screen.getByText('3 days')).toBeInTheDocument();
    expect(screen.getByText('Haircut')).toBeInTheDocument();
  });

  it('resets without navigating, and opens history on card tap', () => {
    const onReset = vi.fn();
    render(<Counter counter={counter} now={NOW} onReset={onReset} resetting={false} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onReset).toHaveBeenCalledWith(counter);
    expect(push).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Haircut'));
    expect(push).toHaveBeenCalledWith('/counter/c1');
  });

  it('disables the reset button while resetting', () => {
    render(<Counter counter={counter} now={NOW} onReset={vi.fn()} resetting={true} />);
    expect(screen.getByRole('button', { name: 'Resetting…' })).toBeDisabled();
  });
});
