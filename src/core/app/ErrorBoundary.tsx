import React from 'react';
import {ErrorBoundary as ReactErrorBoundary} from 'react-error-boundary';

import ErrorFallback from '@atoms/ErrorFallback';
import {reportErrorToSentry} from '@core/logging/sentryReporting';
import {logger} from '@core/logging/LoggerService';
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

        reportErrorToSentry(normalizedError, {
          componentStack: info.componentStack,
        });
        logger.error(
          'ErrorBoundary caught:',
          normalizedError.message,
          info.componentStack,
        );
        recordCrashError(normalizedError, info.componentStack ?? 'ErrorBoundary');
      }}
      onReset={() => {
        logger.debug('ErrorBoundary reset');
      }}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
