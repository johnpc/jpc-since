import { describe, it, expect, vi, beforeEach } from 'vitest';

const m = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  del: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  USER_POOL: { authMode: 'userPool' },
  dataClient: {
    models: { Counter: { list: m.list, create: m.create, update: m.update, delete: m.del } },
  },
}));

import { createCounter, deleteCounter, listCounters, updateCounter } from './countersApi';

const input = {
  emoji: '💇',
  title: 'Haircut',
  sinceAt: '2026-06-01T00:00:00Z',
  hexColor: '#abc',
};

describe('countersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listCounters lists with userPool, oldest-since first', async () => {
    m.list.mockResolvedValue({
      data: [
        { id: 'b', sinceAt: '2026-06-10T00:00:00Z' },
        { id: 'a', sinceAt: '2026-06-01T00:00:00Z' },
      ],
    });
    const result = await listCounters();
    expect(m.list).toHaveBeenCalledWith({ limit: 500, authMode: 'userPool' });
    expect(result.map((c) => c.id)).toEqual(['a', 'b']);
  });

  it('createCounter passes a null reminder as undefined and returns the row', async () => {
    m.create.mockResolvedValue({ data: { id: 'c1', ...input }, errors: null });
    const row = await createCounter({ ...input, reminderDays: null });
    expect(m.create).toHaveBeenCalledWith(
      { ...input, reminderDays: undefined },
      { authMode: 'userPool' },
    );
    expect(row.id).toBe('c1');
  });

  it('createCounter throws on error', async () => {
    m.create.mockResolvedValue({ data: null, errors: [{ message: 'nope' }] });
    await expect(createCounter(input)).rejects.toThrow('nope');
  });

  it('listCounters tolerates rows with a missing sinceAt', async () => {
    m.list.mockResolvedValue({ data: [{ id: 'b', sinceAt: undefined }, { id: 'a' }] });
    const result = await listCounters();
    expect(result).toHaveLength(2);
  });

  it('updateCounter patches by id', async () => {
    m.update.mockResolvedValue({ data: { id: 'c1' }, errors: null });
    await updateCounter('c1', { sinceAt: '2026-06-28T00:00:00Z' });
    expect(m.update).toHaveBeenCalledWith(
      { id: 'c1', sinceAt: '2026-06-28T00:00:00Z' },
      { authMode: 'userPool' },
    );
  });

  it('updateCounter throws on error', async () => {
    m.update.mockResolvedValue({ data: null, errors: [{ message: 'stale' }] });
    await expect(updateCounter('c1', {})).rejects.toThrow('stale');
  });

  it('deleteCounter throws on error', async () => {
    m.del.mockResolvedValue({ errors: [{ message: 'boom' }] });
    await expect(deleteCounter('c1')).rejects.toThrow('boom');
  });
});
