import * as Sentry from '@sentry/react-native';

export type SentryErrorContext = Record<string, unknown>;

export const isSentryEnabled = (): boolean => Boolean(Sentry.getClient());

export const reportErrorToSentry = (
  error: unknown,
  context?: SentryErrorContext,
): void => {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.withScope(scope => {
    if (context && Object.keys(context).length > 0) {
      scope.setContext('error_context', context);
    }

    if (error instanceof Error) {
      Sentry.captureException(error);
      return;
    }

    if (typeof error === 'string') {
      Sentry.captureMessage(error, 'error');
      return;
    }

    Sentry.captureException(
      new Error(typeof error === 'object' ? JSON.stringify(error) : String(error)),
    );
  });
};

export const setSentryUser = (userId: string, role?: string): void => {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.setUser({
    id: userId,
    ...(role ? {role} : {}),
  });
};

export const clearSentryUser = (): void => {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.setUser(null);
};
