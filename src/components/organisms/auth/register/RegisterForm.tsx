//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ScreenWidth} from '@rneui/base';

//* components import
import EmailOrPhoneTextInput from '@molecules/EmailOrPhoneTextInput';
import PasswordTextInput from '@molecules/PasswordTextInput';

//* types import
import type {Dispatch, SetStateAction} from 'react';

interface RegisterFormProps {
  emailOrPhone: string;
  setEmailOrPhone: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  toggleShowPassword: () => void;
  toggleShowConfirmPassword: () => void;
}

const RegisterForm = (props: RegisterFormProps): React.JSX.Element => {
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
      <PasswordTextInput
        password={props.confirmPassword}
        setPassword={props.setConfirmPassword}
        showPassword={props.showConfirmPassword}
        toggleShowPassword={props.toggleShowConfirmPassword}
      />
    </View>
  );
};

export default RegisterForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: ScreenWidth,
  },
});
