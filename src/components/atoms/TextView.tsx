//* packages import
import React from 'react';
import {Text, TextProps, View, ViewStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';

interface TextViewProps extends TextProps {
  containerStyle?: ViewStyle;
  text: string;
}

const TextView = (props: TextViewProps): React.JSX.Element => {
  const themeTextColor = useTheme().colors.text;

  return (
    <View style={props.containerStyle}>
      <Text
        style={[{color: themeTextColor}, props.style]}
        numberOfLines={props.numberOfLines}>
        {props.text}
      </Text>
    </View>
  );
};

export default TextView;
