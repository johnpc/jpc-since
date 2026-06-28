import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './features/auth/AuthProvider';
import { AppRoutes } from './AppRoutes';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode — Since is dark-only, so we lock the dark palette with
 * dark.always (not dark.system, which would follow the OS setting).
 */
import '@ionic/react/css/palettes/dark.always.css';

/* Brand fonts (bundled) + design tokens */
import './theme/fonts';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <IonReactRouter>
          <AppRoutes />
        </IonReactRouter>
      </AuthProvider>
    </QueryClientProvider>
  </IonApp>
);

export default App;
