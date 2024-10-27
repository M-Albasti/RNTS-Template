import React from 'react';
import {Text, TextProps, View, ViewStyle} from 'react-native';

interface TextViewProps extends TextProps {
  containerStyle?: ViewStyle;
  text: string;
}

const TextView = (props: TextViewProps): React.JSX.Element => {
  return (
    <View style={props.containerStyle}>
      <Text style={props.style} numberOfLines={props.numberOfLines}>
        {props.text}
      </Text>
    </View>
  );
};

export default TextView;
