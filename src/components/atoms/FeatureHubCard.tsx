import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import type {FontsFamily} from '@Types/fontsFamily';

interface FeatureHubCardProps {
  title: string;
  subtitle: string;
  iconType: FontsFamily;
  iconName: string;
  accentColor?: string;
  onPress: () => void;
}

const FeatureHubCard = ({
  title,
  subtitle,
  iconType,
  iconName,
  accentColor,
  onPress,
}: FeatureHubCardProps): React.JSX.Element => {
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      card: {
        flex: tokens.layout.flex.fill,
        minWidth: '46%' as const,
        backgroundColor: tokens.colors.surface,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.md,
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
        ...tokens.shadows.sm,
      },
      cardPressed: {
        backgroundColor: tokens.colors.surfaceSecondary,
        ...tokens.shadows.none,
      },
      iconWrap: {
        width: 44,
        height: 44,
        borderRadius: tokens.radius.md,
        ...tokens.layout.presets.center,
        backgroundColor: accentColor || tokens.colors.primaryMuted,
        marginBottom: tokens.spacing.sm,
      },
    }),
  );

  return (
    <Pressable
      style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}>
      <View style={styles.iconWrap}>
        <IconView iconType={iconType} name={iconName} size={22} />
      </View>
      <Heading text={title} level="h3" />
      <TextView text={subtitle} variant="caption" muted />
    </Pressable>
  );
};

export default FeatureHubCard;
