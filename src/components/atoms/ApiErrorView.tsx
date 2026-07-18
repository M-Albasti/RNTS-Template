import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import AnimatedEntrance from '@atoms/AnimatedEntrance';
import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

import {resolveApiErrorViewStyles} from './styles/resolveApiErrorViewStyles';

export type ApiErrorViewProps = {
  message?: string;
  title?: string;
  onRetry?: () => void;
  retryLabel?: string;
  /** When used inside lists — avoid flex:1 stretch. */
  compact?: boolean;
};

const ApiErrorView = ({
  message,
  title,
  onRetry,
  retryLabel,
  compact = false,
}: ApiErrorViewProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors, sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveApiErrorViewStyles);

  return (
    <AnimatedEntrance>
      <View style={[styles.container, compact ? styles.compact : null]}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <IconView
              iconType="Ionicons"
              name="cloud-offline-outline"
              size={sizes.iconSm}
              color={colors.error}
            />
          </View>
          <Heading
            text={title ?? t('errors.somethingWentWrong')}
            level="h3"
            align="center"
            style={styles.title}
          />
          <TextView
            text={message ?? t('errors.loadFailed')}
            variant="bodySmall"
            muted
            align="center"
            style={styles.message}
          />
          {onRetry ? (
            <Button
              label={retryLabel ?? t('errors.tryAgain')}
              variant="danger"
              size="sm"
              flat
              onPress={onRetry}
              style={styles.action}
            />
          ) : null}
        </View>
      </View>
    </AnimatedEntrance>
  );
};

export default ApiErrorView;
