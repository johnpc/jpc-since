import { describe, it, expect, vi } from 'vitest';

const generateClient = vi.hoisted(() => vi.fn(() => ({ models: {} })));
vi.mock('aws-amplify/data', () => ({ generateClient }));

import { dataClient, USER_POOL } from './dataClient';

describe('dataClient', () => {
  it('generates a userPool-mode client', () => {
    expect(generateClient).toHaveBeenCalledWith({ authMode: 'userPool' });
    expect(dataClient).toBeDefined();
  });

  it('exposes the shared userPool auth option', () => {
    expect(USER_POOL).toEqual({ authMode: 'userPool' });
  });
});
