//* packages import
import React from 'react';
import {ErrorBoundary as ReactErrorBoundary} from 'react-error-boundary';

//* components import
import ErrorFallback from './ErrorFallback';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary = ({children}: ErrorBoundaryProps): React.JSX.Element => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, componentStack) => {
        console.log('Error =>', error);
        console.log('Component Stack =>', componentStack);
      }}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
        console.log('Reset');
      }}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
