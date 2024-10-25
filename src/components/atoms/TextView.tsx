import {StyleSheet, Text, TextProps, View, ViewStyle} from 'react-native';
import React from 'react';

const TextView = (props: TextProps & ViewStyle) => {
  return (
    <View>
      <Text>TextView</Text>
    </View>
  );
};

export default TextView;

const styles = StyleSheet.create({});
