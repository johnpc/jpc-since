import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const form = vi.hoisted(() => ({
  values: { emoji: '⏱️', title: '', hexColor: '#7c3aed', reminderDays: '' },
  error: null as string | null,
  busy: false,
  set: vi.fn(),
  submit: vi.fn(),
}));
vi.mock('./useCounterForm', () => ({ useCounterForm: () => form }));

import { CounterForm } from './CounterForm';

describe('CounterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    form.error = null;
  });

  it('edits fields and submits', () => {
    render(<CounterForm onDone={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('Haircut'), { target: { value: 'Oil change' } });
    expect(form.set).toHaveBeenCalledWith('title', 'Oil change');
    fireEvent.click(screen.getByLabelText('color #2563eb'));
    expect(form.set).toHaveBeenCalledWith('hexColor', '#2563eb');
    fireEvent.change(screen.getByDisplayValue('⏱️'), { target: { value: '💇' } });
    expect(form.set).toHaveBeenCalledWith('emoji', '💇');
    fireEvent.change(screen.getByPlaceholderText('e.g. 42'), { target: { value: '30' } });
    expect(form.set).toHaveBeenCalledWith('reminderDays', '30');
    fireEvent.click(screen.getByRole('button', { name: 'Start counting' }));
    expect(form.submit).toHaveBeenCalled();
  });

  it('shows a validation error', () => {
    form.error = 'Give it a name.';
    render(<CounterForm onDone={vi.fn()} />);
    expect(screen.getByText('Give it a name.')).toBeInTheDocument();
  });

  it('shows a busy, disabled CTA while saving', () => {
    form.busy = true;
    render(<CounterForm onDone={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
    form.busy = false;
  });
});
