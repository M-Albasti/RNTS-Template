//* packages import
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

//* components import
import LoginButton from '@molecules/LoginButton';
import LoginRegisterButton from '@molecules/LoginRegisterButton';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface LoginButtonsProps {
  navigation: AppStackNavigationProp<'Login' | 'FirebaseEmailLogin'>;
  registerType: AppRouteProp<'Register' | 'FirebaseEmailRegister'>;
  onLogin: () => void;
}

const LoginButtons = (props: LoginButtonsProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <LoginButton onLogin={props.onLogin} />
      <LoginRegisterButton navigation={props.navigation} registerType={props.registerType} />
    </View>
  );
};

export default LoginButtons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
