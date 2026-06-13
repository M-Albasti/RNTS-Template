//* packages import
import React from 'react';
import {ErrorBoundary as ReactErrorBoundary} from 'react-error-boundary';
import * as Sentry from '@sentry/react-native';

//* components import
import ErrorFallback from '@atoms/ErrorFallback';

//* utils import
import {logger} from '@utils/logger';
import {recordCrashError} from '@services/firebaseServices/firebaseCrashlyticsService';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary = ({children}: ErrorBoundaryProps): React.JSX.Element => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        const normalizedError =
          error instanceof Error ? error : new Error(String(error));
        Sentry.captureException(normalizedError, {
          extra: {componentStack: info.componentStack},
        });
        logger.error(
          'ErrorBoundary caught:',
          normalizedError.message,
          info.componentStack,
        );
        recordCrashError(normalizedError, info.componentStack ?? 'ErrorBoundary');
      }}
      onReset={() => {
        // User tapped "Try Again" — boundary remounts children without full app restart.
        logger.debug('ErrorBoundary reset');
      }}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
