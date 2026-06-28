import { useChangePassword } from './useChangePassword';
import './settings.css';

/** Change-password card. Presentational shell over useChangePassword. */
export function ChangePassword() {
  const f = useChangePassword();

  return (
    <section className="settings__card">
      <h2 className="settings__h2 since-headline">Change password</h2>
      <input
        className="settings__input"
        type="password"
        autoComplete="current-password"
        placeholder="Current password"
        value={f.oldPassword}
        onChange={(e) => f.setOld(e.target.value)}
      />
      <input
        className="settings__input"
        type="password"
        autoComplete="new-password"
        placeholder="New password"
        value={f.newPassword}
        onChange={(e) => f.setNew(e.target.value)}
      />
      <input
        className="settings__input"
        type="password"
        autoComplete="new-password"
        placeholder="Confirm new password"
        value={f.confirm}
        onChange={(e) => f.setConfirm(e.target.value)}
      />
      {f.error && <p className="settings__error">{f.error}</p>}
      {f.done && <p className="settings__ok">Password updated.</p>}
      <button type="button" className="settings__btn" disabled={f.busy} onClick={f.submit}>
        {f.busy ? 'Updating…' : 'Update password'}
      </button>
    </section>
  );
}
