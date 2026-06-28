import { describe, it, expect, beforeEach } from 'vitest';
import {
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
  getSortPreference,
  setSortPreference,
  validatePasswordChange,
} from './settingsConfig';

describe('support contact', () => {
  it('builds a mailto with a prefilled subject', () => {
    expect(SUPPORT_MAILTO).toContain(`mailto:${SUPPORT_EMAIL}`);
    expect(SUPPORT_MAILTO).toContain('subject=Since%20support');
  });
});

describe('sort preference', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to oldest when unset or unknown', () => {
    expect(getSortPreference()).toBe('oldest');
    localStorage.setItem('since.pref.sort', 'bogus');
    expect(getSortPreference()).toBe('oldest');
  });

  it('round-trips newest', () => {
    setSortPreference('newest');
    expect(getSortPreference()).toBe('newest');
  });
});

describe('validatePasswordChange', () => {
  it('requires the current password', () => {
    expect(validatePasswordChange('', 'abcd1234', 'abcd1234')).toMatch(/current password/i);
  });
  it('enforces an 8-char minimum', () => {
    expect(validatePasswordChange('old', 'short', 'short')).toMatch(/at least 8/i);
  });
  it('requires the confirmation to match', () => {
    expect(validatePasswordChange('old', 'abcd1234', 'abcd9999')).toMatch(/do not match/i);
  });
  it('requires the new password to differ', () => {
    expect(validatePasswordChange('abcd1234', 'abcd1234', 'abcd1234')).toMatch(/differ/i);
  });
  it('returns null when valid', () => {
    expect(validatePasswordChange('oldpass1', 'abcd1234', 'abcd1234')).toBeNull();
  });
});
