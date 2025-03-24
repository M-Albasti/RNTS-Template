import React from 'react';
import {StyleSheet, View} from 'react-native';
import EmailOrPhoneTextInput from '@molecules/emailOrPhoneTextInput';
import PasswordTextInput from '@molecules/passwordTextInput';
import {ScreenWidth} from '@rneui/base';

//* types import
import type {Dispatch, SetStateAction} from 'react';

interface LoginFormProps {
  emailOrPhone: string;
  setEmailOrPhone: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  showPassword: boolean;
  toggleShowPassword: () => void;
}

const LoginForm = (props: LoginFormProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <EmailOrPhoneTextInput
        emailOrPhone={props.emailOrPhone}
        setEmailOrPhone={props.setEmailOrPhone}
      />
      <PasswordTextInput
        password={props.password}
        setPassword={props.setPassword}
        showPassword={props.showPassword}
        toggleShowPassword={props.toggleShowPassword}
      />
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: ScreenWidth,
  },
});
