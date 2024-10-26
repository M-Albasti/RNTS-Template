import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';

const Login = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Login</Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.replace('DrawerRoot');
        }}>
        <Text style={styles.textStyle}>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
