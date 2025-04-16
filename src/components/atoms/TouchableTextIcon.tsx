//* packages import
import React from 'react';
import {TouchableOpacity, TouchableOpacityProps, ViewStyle} from 'react-native';
import {IconButtonProps} from 'react-native-vector-icons/Icon';

//* components import
import Icon from './Icon';
import TextView from './TextView';

//* types import
import {FontsFamily} from '@Types/fontsFamily';

interface TouchableIconProps extends IconButtonProps {
  touchableStyle?: TouchableOpacityProps['style'];
  containerStyle?: ViewStyle;
  iconType: FontsFamily;
  text: string;
}

const TouchableTextIcon = (props: TouchableIconProps): React.JSX.Element => {
  return (
    <TouchableOpacity onPress={props.onPress} style={props.touchableStyle}>
      <Icon
        name={props.name}
        size={props.size}
        color={props.color}
        iconType={props.iconType}
      />
      <TextView
        text={props.text}
        style={props.style}
        containerStyle={props.containerStyle}
      />
    </TouchableOpacity>
  );
};

export default TouchableTextIcon;
