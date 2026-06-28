import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Stub emoji-mart (heavy ESM, not jsdom-friendly) with a fake grid that fires
// onEmojiSelect when clicked.
vi.mock('@emoji-mart/data', () => ({ default: {} }));
vi.mock('@emoji-mart/react', () => ({
  default: ({ onEmojiSelect }: { onEmojiSelect: (s: { native: string }) => void }) => (
    <button type="button" onClick={() => onEmojiSelect({ native: '🎉' })}>
      mock-picker
    </button>
  ),
}));

import { EmojiField } from './EmojiField';

describe('EmojiField', () => {
  it('shows the current emoji and opens the picker on tap', () => {
    render(<EmojiField value="⏱️" onSelect={vi.fn()} />);
    expect(screen.getByText('⏱️')).toBeInTheDocument();
    expect(screen.queryByText('mock-picker')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Choose emoji/ }));
    expect(screen.getByText('mock-picker')).toBeInTheDocument();
  });

  it('reports a pick and closes the picker', () => {
    const onSelect = vi.fn();
    render(<EmojiField value="⏱️" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /Choose emoji/ }));
    fireEvent.click(screen.getByText('mock-picker'));
    expect(onSelect).toHaveBeenCalledWith('🎉');
    expect(screen.queryByText('mock-picker')).not.toBeInTheDocument();
  });
});
