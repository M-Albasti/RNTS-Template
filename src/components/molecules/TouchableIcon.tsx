import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '../atoms/Icon';
import {IconButtonProps} from 'react-native-vector-icons/Icon';
import {FontsFamily} from '@types/fontsFamily';

interface TouchableIconProps extends IconButtonProps {
  iconType: FontsFamily;
}

const TouchableIcon = (props: TouchableIconProps) => {
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

const styles = StyleSheet.create({});
