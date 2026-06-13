import React from 'react';
import {FallbackProps} from 'react-error-boundary';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      container: {
        flex: tokens.layout.flex.fill,
        justifyContent: 'center',
        alignItems: 'center',
        padding: tokens.spacing.xl,
        backgroundColor: tokens.colors.background,
      },
      errorText: {
        color: tokens.colors.error,
      },
    }),
  );

  return (
    <View style={styles.container}>
      <Card constrained>
        <Heading text={t('errors.somethingWentWrong')} level="h2" align="center" />
        <Spacer size="sm" />
        <TextView text={t('errors.sectionProblem')} variant="bodySmall" muted align="center" />
        {__DEV__ ? (
          <>
            <Spacer size="md" />
            <TextView
              text={getErrorMessage(error)}
              variant="caption"
              align="center"
              style={styles.errorText}
            />
          </>
        ) : null}
        <Spacer size="lg" />
        <Button label={t('errors.tryAgain')} fullWidth onPress={resetErrorBoundary} />
      </Card>
    </View>
  );
};

export default ErrorFallback;
