import React from 'react';
import {
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

interface TextViewProps
  extends Omit<TextProps, 'style'>,
    Omit<TouchableOpacityProps, 'style'> {
  textStyle: TextProps['style'];
  touchableStyle: TouchableOpacityProps['style'];
  text: string;
}

const TouchableText = (props: TextViewProps): React.JSX.Element => {
  return (
    <TouchableOpacity style={props.touchableStyle} onPress={props.onPress}>
      <Text style={props.textStyle} numberOfLines={props.numberOfLines}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export default TouchableText;
