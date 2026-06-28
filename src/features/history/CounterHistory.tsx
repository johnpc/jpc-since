import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useCounters } from '../counters/useCounters';
import { useNow } from '../counters/useNow';
import { useCounterHistory } from './useHistory';
import { StreakStats } from './StreakStats';
import { ResetList } from './ResetList';
import './history.css';

/** Per-counter detail: streak stats + the list of past intervals. */
export function CounterHistory() {
  const { id } = useParams<{ id: string }>();
  const { counters } = useCounters();
  const counter = counters.find((c) => c.id === id) ?? null;
  // Tick live so "current" elapsed updates without a remount.
  const now = useNow();
  const { resets, streaks, isLoading } = useCounterHistory(counter, now);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{counter ? `${counter.emoji} ${counter.title}` : 'History'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="history">
        {!counter && !isLoading && (
          <p className="history__empty since-dek">This counter no longer exists.</p>
        )}
        {streaks && <StreakStats streaks={streaks} />}
        <ResetList resets={resets} />
      </IonContent>
    </IonPage>
  );
}
