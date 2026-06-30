import React from 'react';
import {View} from 'react-native';

import Heading from '@atoms/Heading';
import TouchableIcon from '@atoms/TouchableIcon';

import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAccessory?: React.ReactNode;
}

const ScreenHeader = ({
  title,
  onBack,
  showBack = true,
  rightAccessory,
}: ScreenHeaderProps): React.JSX.Element => {
  const {sizes} = useThemeTokens();
  const styles = useThemedStyles(tokens => ({
    row: {
      ...tokens.layout.presets.rowBetween,
      marginBottom: tokens.spacing.md,
      minHeight: tokens.sizes.touchTarget,
    },
    side: {
      width: tokens.sizes.touchTarget,
      ...tokens.layout.presets.center,
    },
    titleWrap: {
      flex: tokens.layout.flex.fill,
      alignItems: tokens.layout.alignItems.center,
    },
  }));

  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {showBack && onBack ? (
          <TouchableIcon
            iconType="Ionicons"
            name="chevron-back"
            size={sizes.iconSm}
            onPress={onBack}
          />
        ) : null}
      </View>
      <View style={styles.titleWrap}>
        <Heading text={title} level="h3" align="center" />
      </View>
      <View style={styles.side}>{rightAccessory}</View>
    </View>
  );
};

export default ScreenHeader;
