import React from 'react';
import {Text, TextProps, View, ViewStyle} from 'react-native';

const TextView = (props: TextProps & ViewStyle): React.JSX.Element => {
  return (
    <View style={props.style}>
      <Text style={props.style} numberOfLines={props.numberOfLines}>
        {props.children}
      </Text>
    </View>
  );
};

export default TextView;
