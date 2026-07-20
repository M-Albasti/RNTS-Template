//* packages import
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {IconButtonProps} from 'react-native-vector-icons/Icon';

//* components import
import Icon from '@atoms/Icon';

//* types import
import {FontsFamily} from '@Types/fontsFamily';

interface TouchableIconProps extends IconButtonProps {
  iconType: FontsFamily;
  accessibilityLabel?: string;
  disabled?: boolean;
}

const TouchableIcon = (props: TouchableIconProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={props.style}
      disabled={props.disabled}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      accessibilityState={props.disabled ? {disabled: true} : undefined}>
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
