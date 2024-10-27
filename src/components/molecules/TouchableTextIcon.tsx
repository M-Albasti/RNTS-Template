import React from 'react';
import {TouchableOpacity, TouchableOpacityProps, ViewStyle} from 'react-native';
import Icon from '../atoms/Icon';
import {IconButtonProps} from 'react-native-vector-icons/Icon';
import {FontsFamily} from '@Types/fontsFamily';
import TextView from '../atoms/TextView';

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
