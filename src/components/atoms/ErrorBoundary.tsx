//* packages import
import React from 'react';
import {ErrorBoundary as ReactErrorBoundary} from 'react-error-boundary';
import * as Sentry from '@sentry/react-native';

//* components import
import ErrorFallback from '@atoms/ErrorFallback';

//* utils import
import {logger} from '@utils/logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary = ({children}: ErrorBoundaryProps): React.JSX.Element => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // Report to Sentry (README promises boundary + Sentry integration).
        Sentry.captureException(error, {
          extra: {componentStack: info.componentStack},
        });
        logger.error('ErrorBoundary caught:', error.message, info.componentStack);
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
