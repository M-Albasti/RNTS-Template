import React from 'react';
import {iconComponents} from '@constants/vectorIcons';
import {FontsFamily} from '@Types/fontsFamily';
import {IconProps} from 'react-native-vector-icons/Icon';
import {View, ViewStyle} from 'react-native';

interface IconViewProps extends IconProps {
  iconType: FontsFamily;
  iconContainerStyle?: ViewStyle;
}

const IconView = (props: IconViewProps): React.JSX.Element => {
  const Icon = iconComponents[props.iconType];

  return (
    <View style={props.iconContainerStyle}>
      <Icon
        name={props.name}
        size={props.size}
        color={props.color}
        style={props.style}
      />
    </View>
  );
};

export default IconView;
