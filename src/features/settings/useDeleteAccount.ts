import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

/**
 * Two-step account deletion: arm a confirmation, then permanently delete. On
 * success the session is cleared and we route back to the welcome screen.
 */
export function useDeleteAccount() {
  const { deleteAccount } = useAuth();
  const history = useHistory();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const arm = useCallback(() => {
    setError(null);
    setConfirming(true);
  }, []);

  const cancel = useCallback(() => setConfirming(false), []);

  const confirm = useCallback(async () => {
    setBusy(true);
    try {
      await deleteAccount();
      history.replace('/welcome');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete account.');
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  }, [deleteAccount, history]);

  return { confirming, error, busy, arm, cancel, confirm };
}
