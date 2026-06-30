import React from 'react';
import {Pressable, View} from 'react-native';

import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveFeatureHubCardStyles} from './styles/resolveFeatureHubCardStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
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
  const {sizes} = useThemeTokens();
  const styles = useThemedStyles(tokens => resolveFeatureHubCardStyles(tokens, accentColor), [accentColor]);

  return (
    <Pressable
      style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}>
      <View style={styles.iconWrap}>
        <IconView iconType={iconType} name={iconName} size={sizes.iconSm} />
      </View>
      <Heading text={title} level="h3" />
      <TextView text={subtitle} variant="caption" muted />
    </Pressable>
  );
};

export default FeatureHubCard;
