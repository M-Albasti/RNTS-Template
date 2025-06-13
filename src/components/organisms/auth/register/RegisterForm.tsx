//* packages import
import React, {useState} from 'react';
import {KeyboardTypeOptions, StyleSheet, View} from 'react-native';
import {ScreenWidth} from '@rneui/base';

//* components import
import EmailOrPhoneTextInput from '@molecules/emailOrPhoneTextInput';
import PasswordTextInput from '@molecules/passwordTextInput';
import RegisterButton from '@molecules/registerButton';

//* services import
import {registerService} from '@services/authServices/registerService';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import {RegisterScreens} from '@Types/registerScreens';

interface RegisterFormProps {
  navigation: AppStackNavigationProp<RegisterScreens>;
  registerType: AppRouteProp<RegisterScreens>;
  keyboardType?: KeyboardTypeOptions;
}

const RegisterForm = (props: RegisterFormProps): React.JSX.Element => {
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onRegister = () => {
    registerService(
      props.registerType.name,
      {
        emailOrPhone: emailOrPhone,
        password: password,
        confirmPassword: confirmPassword,
      },
      dispatch,
    );
  };
  return (
    <View style={styles.container}>
      <EmailOrPhoneTextInput
        emailOrPhone={emailOrPhone}
        setEmailOrPhone={setEmailOrPhone}
        keyboardType={props.keyboardType}
      />
      <PasswordTextInput
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        toggleShowPassword={toggleShowPassword}
      />
      <PasswordTextInput
        password={confirmPassword}
        setPassword={setConfirmPassword}
        showPassword={showConfirmPassword}
        toggleShowPassword={toggleShowConfirmPassword}
      />
      <RegisterButton
        onRegister={onRegister}
        registerType={props.registerType}
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
