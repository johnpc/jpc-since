import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StreakStats } from './StreakStats';

describe('StreakStats', () => {
  it('renders the four stat cells', () => {
    render(
      <StreakStats streaks={{ currentDays: 5, resetCount: 2, longestDays: 10, averageDays: 7 }} />,
    );
    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.getByText('5d')).toBeInTheDocument();
    expect(screen.getByText('Resets')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Longest')).toBeInTheDocument();
    expect(screen.getByText('Average')).toBeInTheDocument();
  });
});
