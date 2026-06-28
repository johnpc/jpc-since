import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthField } from './AuthField';

describe('AuthField', () => {
  it('renders its label and reports changes', () => {
    const onChange = vi.fn();
    render(<AuthField label="Email" type="email" value="a@b.com" onChange={onChange} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    const input = screen.getByDisplayValue('a@b.com');
    fireEvent.change(input, { target: { value: 'x@y.com' } });
    expect(onChange).toHaveBeenCalledWith('x@y.com');
  });
});
