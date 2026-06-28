/** Static settings/support constants + pure preference helpers. */

/** Where "Contact support" points. */
export const SUPPORT_EMAIL = 'john@johncorser.com';

/** mailto: link prefilled with a Since support subject. */
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  'Since support',
)}`;

const SORT_KEY = 'since.pref.sort';
export type CounterSort = 'oldest' | 'newest';

/** The persisted home-screen sort preference (defaults to oldest-since first). */
export function getSortPreference(): CounterSort {
  return localStorage.getItem(SORT_KEY) === 'newest' ? 'newest' : 'oldest';
}

/** Persist the home-screen sort preference. */
export function setSortPreference(sort: CounterSort): void {
  localStorage.setItem(SORT_KEY, sort);
}

/** Validate a password change before hitting Cognito. Returns an error or null. */
export function validatePasswordChange(
  oldPassword: string,
  newPassword: string,
  confirm: string,
): string | null {
  if (!oldPassword) return 'Enter your current password.';
  if (newPassword.length < 8) return 'New password must be at least 8 characters.';
  if (newPassword !== confirm) return 'New passwords do not match.';
  if (newPassword === oldPassword) return 'New password must differ from the current one.';
  return null;
}
