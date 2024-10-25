import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {IconButtonProps} from 'react-native-vector-icons/Icon';
import type {FontsFamily} from '@types/fontsFamily';
import {iconComponents} from '@constants/vectorIcons';

interface TouchableIconProps extends IconButtonProps {
  iconType: FontsFamily;
}

const TouchableIcon = (props: TouchableIconProps) => {
  const Icon = iconComponents[props.iconType];
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
      <Icon name={props.name} size={props.size} color={props.color} />
    </TouchableOpacity>
  );
};

export default TouchableIcon;

const styles = StyleSheet.create({});
