import {
  feedbackIntegration,
  getClient,
  getGlobalScope,
  getIsolationScope,
  httpClientIntegration,
  httpContextIntegration,
  init,
  mobileReplayIntegration,
} from '@sentry/react-native';
import {Platform} from 'react-native';
import {APP_ENV, SENTRY_DSN} from '@env';

import {navigationIntegration} from '@navigation/navigationIntegration';
import {
  patchScopeNativeBreadcrumbSanitizer,
  sanitizeBreadcrumb,
  sanitizeSentryEvent,
} from '@utils/sentryBreadcrumbSanitizer';

import {name as appName} from '../../../app.json';
import {version as appVersion} from '../../../package.json';

const stripQuotes = (value: string | undefined): string =>
  (value ?? '').trim().replace(/^['"]|['"]$/g, '');

const readRuntimeEnv = (key: string): string | undefined => {
  const env = (
    globalThis as typeof globalThis & {
      process?: {env?: Record<string, string | undefined>};
    }
  ).process?.env;

  return env?.[key];
};

const resolveSentryDsn = (): string =>
  stripQuotes(readRuntimeEnv('EXPO_PUBLIC_SENTRY_DSN')) ||
  stripQuotes(SENTRY_DSN) ||
  stripQuotes(readRuntimeEnv('SENTRY_DSN'));

const resolveAppEnvironment = (isDevelopment: boolean): string =>
  readRuntimeEnv('EXPO_PUBLIC_ENV') ||
  APP_ENV ||
  (isDevelopment ? 'development' : 'production');

const resolveReleaseMetadata = (): {release: string; dist: string} => {
  const slug = appName.toLowerCase().replace(/\s+/g, '-');
  const dist =
    Platform.select({
      ios: '1',
      android: '1',
      default: '',
    }) ?? '';

  return {
    release: `${slug}@${appVersion}`,
    dist: String(dist),
  };
};

export const initCrashReporter = (): void => {
  const dsn = resolveSentryDsn();

  if (!dsn) {
    if (!__DEV__) {
      console.warn('[Sentry] EXPO_PUBLIC_SENTRY_DSN / SENTRY_DSN is missing — crash reporting disabled.');
    }
    return;
  }

  if (getClient()) {
    return;
  }

  const isDevelopment = __DEV__ || resolveAppEnvironment(true) === 'development';
  const isExpoGo = false;
  const {release, dist} = resolveReleaseMetadata();

  init({
    dsn,
    sendDefaultPii: true,
    maxValueLength: 16384,
    normalizeDepth: 8,
    enableAutoSessionTracking: true,
    enableAutoPerformanceTracing: true,
    enableUserInteractionTracing: true,
    enableNativeFramesTracking: !isExpoGo,
    debug: true,
    enableLogs: true,
    sessionTrackingIntervalMillis: 10000,
    tracesSampleRate: isDevelopment ? 1.0 : 0.2,
    profilesSampleRate: isDevelopment ? 1.0 : 0.1,
    replaysSessionSampleRate: isDevelopment ? 0 : 0.1,
    replaysOnErrorSampleRate: isDevelopment ? 0 : 1,
    environment: resolveAppEnvironment(isDevelopment),
    release,
    dist,
    spotlight: false,
    integrations: [
      navigationIntegration,
      httpClientIntegration({
        failedRequestStatusCodes: [[400, 599]],
      }),
      httpContextIntegration(),
      ...(isDevelopment ? [] : [mobileReplayIntegration()]),
      feedbackIntegration(),
    ],
    beforeBreadcrumb: breadcrumb => sanitizeBreadcrumb(breadcrumb),
    beforeSend: event => sanitizeSentryEvent(event),
  });

  patchScopeNativeBreadcrumbSanitizer(getGlobalScope());
  patchScopeNativeBreadcrumbSanitizer(getIsolationScope());
};
