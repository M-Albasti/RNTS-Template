//* packages import
import {
  init,
  mobileReplayIntegration,
  feedbackIntegration,
  getClient,
} from '@sentry/react-native';
import {isEmpty} from 'lodash';

//* navigators import
import {navigationIntegration} from '@navigation/NavigationContainer';

if (!getClient() && isEmpty(getClient())) {
  init({
    dsn: 'https://f1bb5369b467a106d557661d309a730c@o4509320259764229.ingest.us.sentry.io/4509320267366400',

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
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
    // Record Session Replays for 10% of Sessions and 100% of Errors
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [
      mobileReplayIntegration(),
      feedbackIntegration(),
      navigationIntegration,
    ],
    // Sentry Env.
    environment: process.env.NODE_ENV,

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    spotlight: __DEV__,
  });
}
