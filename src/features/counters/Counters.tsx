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
import { useNow } from './useNow';
import { sortCounters } from './sortCounters';
import { usePreferences } from '../settings/usePreferences';
import { Counter } from './Counter';
import { CounterForm } from './CounterForm';
import './counters.css';

/** Home screen: the user's count-up cards + a create-counter modal. */
export function Counters() {
  const { counters, isLoading, deleteCounter } = useCounters();
  const { reset, resettingId } = useReset();
  const { sort } = usePreferences();
  const [showForm, setShowForm] = useState(false);
  // Ticks every second so the "since" figures count up live (not just on mount).
  const now = useNow();
  const ordered = sortCounters(counters, sort);
  useReminders(counters);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Since</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowForm(true)}>Add</IonButton>
            <IonButton routerLink="/settings">Settings</IonButton>
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
          {ordered.map((c) => (
            <Counter
              key={c.id}
              counter={c}
              now={now}
              onReset={reset}
              onDelete={(counter) => deleteCounter(counter.id)}
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
