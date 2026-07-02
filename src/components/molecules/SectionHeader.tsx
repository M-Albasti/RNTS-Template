import React from 'react';
import {Pressable, View} from 'react-native';

import Heading from '@atoms/Heading';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

const SectionHeader = ({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}: Props): React.JSX.Element => {
  const {colors} = useThemeTokens();
  const styles = useThemedStyles(tokens => ({
    row: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'flex-end' as const,
      marginBottom: tokens.spacing.sm,
    },
    textWrap: {flex: tokens.layout.flex.fill, paddingRight: tokens.spacing.sm},
    action: {
      paddingVertical: tokens.spacing.xxs,
      paddingHorizontal: tokens.spacing.xs,
    },
  }));

  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Heading text={title} level="h2" />
        {subtitle ? <TextView text={subtitle} variant="caption" muted /> : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable style={styles.action} onPress={onActionPress}>
          <TextView text={actionLabel} variant="bodySmall" style={{color: colors.primary}} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default SectionHeader;
