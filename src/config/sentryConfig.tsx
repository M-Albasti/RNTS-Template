//* packages import
import {
  init,
  mobileReplayIntegration,
  feedbackIntegration,
  getClient,
} from '@sentry/react-native';
import {isEmpty} from 'lodash';
import {SENTRY_DSN, APP_ENV} from '@env';

//* navigators import
import {navigationIntegration} from '@navigation/NavigationContainer';

// Guard: init Sentry once. DSN comes from .env (see .env.example) — never commit real keys.
const sentryDsn =
  SENTRY_DSN ||
  'https://f1bb5369b467a106d557661d309a730c@o4509320259764229.ingest.us.sentry.io/4509320267366400';

if (!getClient() && isEmpty(getClient()) && sentryDsn) {
  init({
    dsn: sentryDsn,

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,
    enableAutoSessionTracking: true,
    enableAutoPerformanceTracing: true,
    // enableCaptureFailedRequests: true, //! Android plugin needed
    enableUserInteractionTracing: true,
    debug: __DEV__,
    // Sessions close after app is 10 seconds in the background.
    sessionTrackingIntervalMillis: 10000,
    // Lower sample rates in production to control quota (1.0 = 100%).
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    profilesSampleRate: __DEV__ ? 1.0 : 0.1,
    // Record Session Replays for 10% of Sessions and 100% of Errors
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [
      mobileReplayIntegration(),
      feedbackIntegration(),
      navigationIntegration,
    ],
    environment: APP_ENV || (__DEV__ ? 'development' : 'production'),

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    spotlight: __DEV__,
  });
}
