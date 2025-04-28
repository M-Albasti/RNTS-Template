//* packages import
import React from 'react';
import {KeyboardTypeOptions, StyleSheet, View} from 'react-native';

//* components import
import LoginHeader from '@organisms/auth/login/LoginHeader';
import LoginForm from '@organisms/auth/login/LoginForm';
import LoginFooter from '@organisms/auth/login/LoginFooter';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import {LoginScreens} from '@Types/loginScreens';
import {RegisterScreens} from '@Types/registerScreens';
import {LoginTypes} from '@Types/loginTypes';

interface LoginTemplateProps {
  navigation: AppStackNavigationProp<LoginScreens>;
  loginType: LoginTypes;
  otpVerification?: boolean;
  register?: boolean;
  registerType?: AppRouteProp<RegisterScreens>;
  otpVerificationType?: string;
  keyboardType?: KeyboardTypeOptions;
}

const LoginTemplate = (props: LoginTemplateProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <LoginHeader />
      <LoginForm
        navigation={props.navigation}
        loginType={props.loginType}
        keyboardType={props.keyboardType}
      />
      <LoginFooter
        navigation={props.navigation}
        register={props.register}
        registerType={props.registerType}
      />
    </View>
  );
};

export default LoginTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
