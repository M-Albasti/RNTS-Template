import React from 'react';
import {Pressable, View} from 'react-native';

import IconView from '@atoms/Icon';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {FontsFamily} from '@Types/fontsFamily';
import {resolveAuthMethodRowStyles} from './styles/resolveAuthMethodRowStyles';

export type AuthMethodRowProps = {
  label: string;
  subtitle?: string;
  iconName: string;
  iconType?: FontsFamily;
  iconColor?: string;
  onPress: () => void;
};

/** Icon + label auth/social row used across login flows. */
const AuthMethodRow = ({
  label,
  subtitle,
  iconName,
  iconType = 'Ionicons',
  iconColor,
  onPress,
}: AuthMethodRowProps): React.JSX.Element => {
  const {colors, sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveAuthMethodRowStyles);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [styles.row, pressed && styles.rowPressed]}>
      <View style={styles.iconWrap}>
        <IconView
          iconType={iconType}
          name={iconName}
          size={sizes.iconSm}
          color={iconColor ?? colors.textPrimary}
        />
      </View>
      <View style={styles.copy}>
        <TextView text={label} variant="body" style={styles.label} />
        {subtitle ? (
          <TextView text={subtitle} variant="caption" muted />
        ) : null}
      </View>
      <IconView
        iconType="Ionicons"
        name="chevron-forward"
        size={18}
        color={colors.textMuted}
      />
    </Pressable>
  );
};

export default AuthMethodRow;
