import { useCallback, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { validatePasswordChange } from './settingsConfig';

/** Form state + submit for the change-password card. */
export function useChangePassword() {
  const { changePassword } = useAuth();
  const [oldPassword, setOld] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = useCallback(async () => {
    const invalid = validatePasswordChange(oldPassword, newPassword, confirm);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError(null);
    setDone(false);
    setBusy(true);
    try {
      await changePassword(oldPassword, newPassword);
      setOld('');
      setNew('');
      setConfirm('');
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not change password.');
    } finally {
      setBusy(false);
    }
  }, [oldPassword, newPassword, confirm, changePassword]);

  return {
    oldPassword,
    setOld,
    newPassword,
    setNew,
    confirm,
    setConfirm,
    error,
    done,
    busy,
    submit,
  };
}
