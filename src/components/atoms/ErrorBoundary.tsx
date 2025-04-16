//* packages import
import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {ErrorBoundary as ReactErrorBoundary} from 'react-error-boundary';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({error, resetErrorBoundary}: ErrorFallbackProps) => {
  return (
    <View style={styles.errorContainer}>
      <Text>Something went wrong:</Text>
      <Text>{error.message}</Text>
      <Button title="Try Again" onPress={resetErrorBoundary} />
    </View>
  );
};

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({children}) => {
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

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
