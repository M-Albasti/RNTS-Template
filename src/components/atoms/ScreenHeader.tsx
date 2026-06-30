import React from 'react';
import {View} from 'react-native';

import Heading from '@atoms/Heading';
import TouchableIcon from '@atoms/TouchableIcon';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveScreenHeaderStyles} from './styles/resolveScreenHeaderStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

const ScreenHeader = ({
  title,
  onBack,
  showBack = true,
}: ScreenHeaderProps): React.JSX.Element => {
  const {sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveScreenHeaderStyles);

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
      <View style={styles.side} />
    </View>
  );
};

export default ScreenHeader;
