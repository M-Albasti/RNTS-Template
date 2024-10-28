import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from './Icon';
import {IconButtonProps} from 'react-native-vector-icons/Icon';
import {FontsFamily} from '@Types/fontsFamily';

interface TouchableIconProps extends IconButtonProps {
  iconType: FontsFamily;
}

const TouchableIcon = (props: TouchableIconProps): React.JSX.Element => {
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
      <Icon
        name={props.name}
        size={props.size}
        color={props.color}
        iconType={props.iconType}
      />
    </TouchableOpacity>
  );
};

export default TouchableIcon;
