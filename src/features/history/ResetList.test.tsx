import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResetList } from './ResetList';
import type { CounterResetRecord } from '../../lib/dataClient';

const reset = (over: Partial<CounterResetRecord>): CounterResetRecord =>
  ({
    id: 'r1',
    counterId: 'c1',
    startedAt: '2026-01-01T00:00:00Z',
    endedAt: '2026-01-04T00:00:00Z',
    durationSeconds: 3 * 86_400,
    ...over,
  }) as CounterResetRecord;

describe('ResetList', () => {
  it('shows an empty message with no resets', () => {
    render(<ResetList resets={[]} />);
    expect(screen.getByText(/first stretch/)).toBeInTheDocument();
  });

  it('renders a row per reset with its span', () => {
    render(<ResetList resets={[reset({})]} />);
    expect(screen.getByText('3 days')).toBeInTheDocument();
    expect(screen.getByText(/ended/)).toBeInTheDocument();
  });
});
