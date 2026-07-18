//* packages import
import {
  init,
  mobileReplayIntegration,
  feedbackIntegration,
  getClient,
  getGlobalScope,
  getIsolationScope,
} from '@sentry/react-native';
import {isEmpty} from 'lodash';
import {SENTRY_DSN, APP_ENV} from '@env';

//* navigators import
import {navigationIntegration} from '@navigation/navigationIntegration';

//* utils import
import {
  patchScopeNativeBreadcrumbSanitizer,
  sanitizeBreadcrumb,
  sanitizeSentryEvent,
} from '@utils/sentryBreadcrumbSanitizer';

// Guard: init Sentry once. DSN comes from .env (see .env.example) — never commit real keys.
const sentryDsn =
  SENTRY_DSN ||
  'https://f1bb5369b467a106d557661d309a730c@o4509320259764229.ingest.us.sentry.io/4509320267366400';

const isDevelopment = __DEV__ || APP_ENV === 'development';

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
    // Native SDK debug logs are very noisy on Android (breadcrumb deserialize, spotlight, sessions).
    debug: false,
    // Sessions close after app is 10 seconds in the background.
    sessionTrackingIntervalMillis: 10000,
    // Lower sample rates in production to control quota (1.0 = 100%).
    tracesSampleRate: isDevelopment ? 1.0 : 0.2,
    profilesSampleRate: isDevelopment ? 1.0 : 0.1,
    // Session Replay is production-only — noisy and unnecessary while developing.
    replaysSessionSampleRate: isDevelopment ? 0 : 0.1,
    replaysOnErrorSampleRate: isDevelopment ? 0 : 1,
    integrations: [
      ...(isDevelopment ? [] : [mobileReplayIntegration()]),
      feedbackIntegration(),
      navigationIntegration,
    ],
    environment: APP_ENV || (isDevelopment ? 'development' : 'production'),
    // Android native bridge requires string values in breadcrumb.data (see sentryBreadcrumbSanitizer).
    beforeBreadcrumb: breadcrumb => sanitizeBreadcrumb(breadcrumb),
    beforeSend: event => sanitizeSentryEvent(event),
    // Spotlight requires a local server on port 8969 — disable unless you run it explicitly.
    spotlight: false,
  });
  patchScopeNativeBreadcrumbSanitizer(getGlobalScope());
  patchScopeNativeBreadcrumbSanitizer(getIsolationScope());
}
