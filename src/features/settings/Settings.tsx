import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useAuth } from '../auth/useAuth';
import { Preferences } from './Preferences';
import { ChangePassword } from './ChangePassword';
import { DangerZone } from './DangerZone';
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from './settingsConfig';
import './settings.css';

/** Account & preferences screen (route /settings). */
export function Settings() {
  const { email, signOut } = useAuth();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="settings">
        <div className="settings__body">
          {email && <p className="settings__email since-meta">Signed in as {email}</p>}

          <Preferences />
          <ChangePassword />

          <section className="settings__card">
            <h2 className="settings__h2 since-headline">Account</h2>
            <button type="button" className="settings__btn" onClick={signOut}>
              Sign out
            </button>
          </section>

          <DangerZone />

          <section className="settings__card">
            <h2 className="settings__h2 since-headline">Support</h2>
            <p className="since-meta">
              Questions or feedback? Email{' '}
              <a className="settings__link" href={SUPPORT_MAILTO}>
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
}
