import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './auth.css';

/** The entry point for new users — see e2e/features/auth/sign-in.feature. */
export function Welcome() {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent fullscreen className="auth">
        <div className="auth__body welcome__body">
          <p className="welcome__wordmark">
            <span className="welcome__mark" aria-hidden="true">
              ↑
            </span>{' '}
            Since
          </p>
          <h1 className="auth__title since-h1">How long has it been?</h1>
          <p className="auth__subtext since-dek">
            Track the time since the last haircut, oil change, or watered plant — and reset with a
            tap when it happens again.
          </p>
          <button type="button" className="auth__cta" onClick={() => history.push('/signup')}>
            Get started
          </button>
          <p className="auth__alt">
            Already have an account?{' '}
            <a className="auth__alt-link" onClick={() => history.push('/signin')}>
              Sign in
            </a>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
}
