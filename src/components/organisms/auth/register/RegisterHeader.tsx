//* packages import
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const RegisterHeader = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text>RegisterHeader</Text>
    </View>
  );
};

export default RegisterHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
