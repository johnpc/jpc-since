import { useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useCounters } from './useCounters';
import { useReset } from '../history/useReset';
import { useReminders } from '../reminders/useReminders';
import { useAuth } from '../auth/useAuth';
import { Counter } from './Counter';
import { CounterForm } from './CounterForm';
import './counters.css';

/** Home screen: the user's count-up cards + a create-counter modal. */
export function Counters() {
  const { counters, isLoading } = useCounters();
  const { signOut } = useAuth();
  const { reset, resettingId } = useReset();
  const [showForm, setShowForm] = useState(false);
  const now = new Date();
  useReminders(counters);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Since</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowForm(true)}>Add</IonButton>
            <IonButton onClick={signOut}>Sign out</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="counters">
        {!isLoading && counters.length === 0 && (
          <p className="counters__empty since-dek">
            Nothing tracked yet. Tap <strong>Add</strong> to start counting since something.
          </p>
        )}
        <div className="counters__grid">
          {counters.map((c) => (
            <Counter
              key={c.id}
              counter={c}
              now={now}
              onReset={reset}
              resetting={resettingId === c.id}
            />
          ))}
        </div>
        <IonModal isOpen={showForm} onDidDismiss={() => setShowForm(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>New counter</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowForm(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="counters">
            <CounterForm onDone={() => setShowForm(false)} />
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
