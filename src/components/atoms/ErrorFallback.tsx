//* packages import
import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

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

export default ErrorFallback;

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
