//* packages import
import React from 'react';
import {
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {useTheme} from '@react-navigation/native';

interface TouchableTextProps {
  text: string;
  textStyle?: TextProps['style'];
  touchableStyle?: TouchableOpacityProps['style'];
  onPress?: TouchableOpacityProps['onPress'];
  numberOfLines?: TextProps['numberOfLines'];
  disabled?: TouchableOpacityProps['disabled'];
  accessibilityLabel?: TouchableOpacityProps['accessibilityLabel'];
  testID?: TouchableOpacityProps['testID'];
}

const TouchableText = (props: TouchableTextProps): React.JSX.Element => {
  const themeTextColor = useTheme().colors.text;

  return (
    <TouchableOpacity
      style={props.touchableStyle}
      onPress={props.onPress}
      disabled={props.disabled}
      accessibilityLabel={props.accessibilityLabel}
      testID={props.testID}>
      <Text
        style={[{color: themeTextColor}, props.textStyle]}
        numberOfLines={props.numberOfLines}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export default TouchableText;
