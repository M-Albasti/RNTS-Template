import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const LoginHeader = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text>LoginHeader</Text>
    </View>
  );
};

export default LoginHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
