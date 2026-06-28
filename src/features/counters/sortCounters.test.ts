import { describe, it, expect } from 'vitest';
import { sortCounters } from './sortCounters';
import type { CounterRecord } from '../../lib/dataClient';

const c = (id: string, sinceAt?: string): CounterRecord => ({ id, sinceAt }) as CounterRecord;

const rows = [
  c('mid', '2026-06-10T00:00:00Z'),
  c('old', '2026-06-01T00:00:00Z'),
  c('new', '2026-06-20T00:00:00Z'),
];

describe('sortCounters', () => {
  it('oldest-since first (longest-since) ascending', () => {
    expect(sortCounters(rows, 'oldest').map((x) => x.id)).toEqual(['old', 'mid', 'new']);
  });
  it('newest-since first descending', () => {
    expect(sortCounters(rows, 'newest').map((x) => x.id)).toEqual(['new', 'mid', 'old']);
  });
  it('does not mutate the input and tolerates a missing sinceAt', () => {
    const input = [c('a'), c('b', '2026-01-01T00:00:00Z')];
    const out = sortCounters(input, 'oldest');
    expect(out).toHaveLength(2);
    expect(input.map((x) => x.id)).toEqual(['a', 'b']);
  });
});
