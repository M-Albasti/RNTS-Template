import React, {useState} from 'react';
import {KeyboardTypeOptions, View} from 'react-native';

import EmailOrPhoneTextInput from '@molecules/emailOrPhoneTextInput';
import PasswordTextInput from '@molecules/passwordTextInput';
import RegisterButton from '@molecules/registerButton';

import {registerService} from '@services/authServices/registerService';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveRegisterFormStyles} from './styles/resolveRegisterFormStyles';
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import {RegisterScreens} from '@Types/registerScreens';

interface RegisterFormProps {
  navigation: AppStackNavigationProp<RegisterScreens>;
  registerType: AppRouteProp<RegisterScreens>;
  keyboardType?: KeyboardTypeOptions;
}

const RegisterForm = (props: RegisterFormProps): React.JSX.Element => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(resolveRegisterFormStyles);

  const onRegister = () => {
    registerService(
      props.registerType.name,
      {emailOrPhone, password, confirmPassword},
      dispatch,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <EmailOrPhoneTextInput
          emailOrPhone={emailOrPhone}
          setEmailOrPhone={setEmailOrPhone}
          keyboardType={props.keyboardType}
        />
        <PasswordTextInput
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(prev => !prev)}
        />
        <PasswordTextInput
          password={confirmPassword}
          setPassword={setConfirmPassword}
          showPassword={showConfirmPassword}
          toggleShowPassword={() => setShowConfirmPassword(prev => !prev)}
        />
      </View>
      <RegisterButton onRegister={onRegister} registerType={props.registerType} />
    </View>
  );
};

export default RegisterForm;
