//* packages import
import React, {FC} from 'react';
import {View, ViewStyle} from 'react-native';
import {IconProps} from 'react-native-vector-icons/Icon';

//* constants import
import {iconComponents} from '@constants/vectorIcons';

//* types import
import {FontsFamily} from '@Types/fontsFamily';
import {useThemeTokens} from '@theme/useThemeTokens';

interface IconViewProps extends IconProps {
  iconType: FontsFamily;
  iconContainerStyle?: ViewStyle;
}

const IconView = (props: IconViewProps): React.JSX.Element => {
  const {colors} = useThemeTokens();
  const Icon = iconComponents[props.iconType] as unknown as FC<IconProps>;
  // Vector icons default to black when color is omitted — invisible on dark surfaces.
  const color = props.color ?? colors.textPrimary;

  return (
    <View style={props.iconContainerStyle}>
      <Icon
        name={props.name}
        size={props.size}
        color={color}
        style={props.style}
      />
    </View>
  );
};

export default IconView;
