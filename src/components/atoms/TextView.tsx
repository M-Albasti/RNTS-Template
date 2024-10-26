import React from 'react';
import {StyleSheet, Text, TextProps, View, ViewStyle} from 'react-native';

const TextView = (props: TextProps & ViewStyle) => {
  return (
    <View style={props.style}>
      <Text style={props.style} numberOfLines={props.numberOfLines}>
        {props.children}
      </Text>
    </View>
  );
};

export default TextView;

const styles = StyleSheet.create({});
