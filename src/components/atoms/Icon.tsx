import React from 'react';
import {iconComponents} from '@constants/vectorIcons';
import {FontsFamily} from '@types/fontsFamily';
import {IconProps} from 'react-native-vector-icons/Icon';

interface TouchableIconProps extends IconProps {
  iconType: FontsFamily;
}

const Icon = (props: TouchableIconProps) => {
  const Icon = iconComponents[props.iconType];

  return <Icon name={props.name} size={props.size} color={props.color} />;
};

export default Icon;
