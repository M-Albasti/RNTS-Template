import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from '../atoms/Icon';
import {IconButtonProps} from 'react-native-vector-icons/Icon';
import {FontsFamily} from '@types/fontsFamily';
import TextView from '../atoms/TextView';

interface TouchableIconProps extends IconButtonProps {
  iconType: FontsFamily;
}

const TouchableTextIcon = (props: TouchableIconProps): React.JSX.Element => {
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
      <Icon
        name={props.name}
        size={props.size}
        color={props.color}
        iconType={props.iconType}
      />
      <TextView children="Record Video" style={props.style} />
    </TouchableOpacity>
  );
};

export default TouchableTextIcon;
