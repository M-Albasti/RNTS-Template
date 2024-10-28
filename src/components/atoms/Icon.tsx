import React from 'react';
import {iconComponents} from '@constants/vectorIcons';
import {FontsFamily} from '@Types/fontsFamily';
import {IconProps} from 'react-native-vector-icons/Icon';

interface IconViewProps extends IconProps {
  iconType: FontsFamily;
}

const IconView = (props: IconViewProps): React.JSX.Element => {
  const Icon = iconComponents[props.iconType];

  return (
    <Icon
      name={props.name}
      size={props.size}
      color={props.color}
      style={props.style}
    />
  );
};

export default IconView;
