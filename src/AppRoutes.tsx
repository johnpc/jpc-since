import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { Welcome } from './features/auth/Welcome';
import { SignUp } from './features/auth/SignUp';
import { SignIn } from './features/auth/SignIn';
import { RedirectIfAuthenticated } from './features/auth/RedirectIfAuthenticated';
import { useStartRoute } from './features/auth/useStartRoute';
import { Counters } from './features/counters/Counters';
import { CounterHistory } from './features/history/CounterHistory';
import { Settings } from './features/settings/Settings';

/** App routes + the initial session gate (no session -> Welcome, session -> Home). */
export function AppRoutes() {
  const start = useStartRoute();
  return (
    <IonRouterOutlet>
      <Route exact path="/welcome">
        <RedirectIfAuthenticated>
          <Welcome />
        </RedirectIfAuthenticated>
      </Route>
      <Route exact path="/signup">
        <RedirectIfAuthenticated>
          <SignUp />
        </RedirectIfAuthenticated>
      </Route>
      <Route exact path="/signin">
        <RedirectIfAuthenticated>
          <SignIn />
        </RedirectIfAuthenticated>
      </Route>
      <Route exact path="/home">
        <Counters />
      </Route>
      <Route exact path="/counter/:id">
        <CounterHistory />
      </Route>
      <Route exact path="/settings">
        <Settings />
      </Route>
      <Route exact path="/">
        {start === 'loading' ? null : <Redirect to={start} />}
      </Route>
    </IonRouterOutlet>
  );
}
