import { useDeleteAccount } from './useDeleteAccount';
import './settings.css';

/** Delete-account card with a two-step confirmation guard. */
export function DangerZone() {
  const d = useDeleteAccount();

  return (
    <section className="settings__card settings__card--danger">
      <h2 className="settings__h2 since-headline">Delete account</h2>
      <p className="since-meta">
        Permanently deletes your account and every counter. This cannot be undone.
      </p>
      {d.error && <p className="settings__error">{d.error}</p>}
      {!d.confirming ? (
        <button type="button" className="settings__btn settings__btn--danger" onClick={d.arm}>
          Delete account
        </button>
      ) : (
        <div className="settings__confirm">
          <p className="settings__label since-meta">Are you sure? This is permanent.</p>
          <button
            type="button"
            className="settings__btn settings__btn--danger"
            disabled={d.busy}
            onClick={d.confirm}
          >
            {d.busy ? 'Deleting…' : 'Yes, delete everything'}
          </button>
          <button type="button" className="settings__btn" disabled={d.busy} onClick={d.cancel}>
            Cancel
          </button>
        </div>
      )}
    </section>
  );
}
