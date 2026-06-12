//* packages import
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';

//* components import
import TextView from '@atoms/TextView';
import TouchableText from '@atoms/TouchableText';

//* constants import
import {appColors} from '@constants/colors';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Friendly fallback UI when a navigator/screen crashes.
 * Shows a short message in production; full error text only in __DEV__.
 */
const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps): React.JSX.Element => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.card}>
        <TextView
          text="Something went wrong"
          style={[styles.title, {color: colors.text}]}
        />
        <TextView
          text="This section ran into a problem. You can try again without restarting the app."
          style={[styles.subtitle, {color: appColors.gray}]}
        />
        {__DEV__ && (
          <TextView
            text={error.message}
            style={[styles.errorDetail, {color: appColors.lightCoral}]}
            numberOfLines={4}
          />
        )}
        <TouchableText
          text="Try Again"
          onPress={resetErrorBoundary}
          textStyle={styles.buttonLabel}
          touchableStyle={[styles.button, {backgroundColor: appColors.primary}]}
        />
      </View>
    </View>
  );
};

export default ErrorFallback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    padding: 24,
    borderRadius: 16,
    backgroundColor: appColors.softWhite,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorDetail: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 8,
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonLabel: {
    color: appColors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});
