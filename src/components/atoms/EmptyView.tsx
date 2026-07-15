import React from 'react';
import {View} from 'react-native';

import AnimatedEntrance from '@atoms/AnimatedEntrance';
import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {FontsFamily} from '@Types/fontsFamily';

import {resolveEmptyViewStyles} from './styles/resolveEmptyViewStyles';

export type EmptyViewProps = {
  title: string;
  message?: string;
  iconType?: FontsFamily;
  iconName?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** When used inside FlashList ListEmptyComponent — avoid flex:1 stretch. */
  compact?: boolean;
};

const EmptyView = ({
  title,
  message,
  iconType = 'Ionicons',
  iconName = 'file-tray-outline',
  actionLabel,
  onAction,
  compact = false,
}: EmptyViewProps): React.JSX.Element => {
  const {colors, sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveEmptyViewStyles);

  return (
    <AnimatedEntrance>
      <View style={[styles.container, compact ? styles.compact : null]}>
        <View style={styles.iconCircle}>
          <IconView
            iconType={iconType}
            name={iconName}
            size={sizes.iconSm}
            color={colors.primary}
          />
        </View>
        <Heading text={title} level="h3" align="center" style={styles.title} />
        {message ? (
          <TextView
            text={message}
            variant="bodySmall"
            muted
            align="center"
            style={styles.message}
          />
        ) : null}
        {actionLabel && onAction ? (
          <Button
            label={actionLabel}
            size="sm"
            onPress={onAction}
            style={styles.action}
          />
        ) : null}
      </View>
    </AnimatedEntrance>
  );
};

export default EmptyView;
