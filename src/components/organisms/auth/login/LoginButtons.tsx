import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TouchableText from '@atoms/TouchableText';
import LoginButton from '@molecules/LoginButton';
import LoginRegisterButton from '@molecules/LoginRegisterButton';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface LoginButtonsProps {
  navigation: AppStackNavigationProp<'Login'>;
  onLogin: () => void;
}

const LoginButtons = (props: LoginButtonsProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <LoginButton onLogin={props.onLogin} />
      <LoginRegisterButton navigation={props.navigation} />
    </View>
  );
};

export default LoginButtons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
