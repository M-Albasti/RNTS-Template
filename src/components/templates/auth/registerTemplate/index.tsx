//* packages import
import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {z} from 'zod';

//* components import
import RegisterHeader from '@organisms/auth/register/RegisterHeader';
import RegisterForm from '@organisms/auth/register/RegisterForm';
import RegisterButtons from '@organisms/auth/register/RegisterButtons';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

//* utils import
import {registerService} from '@services/authServices/registerService';
import {useAppDispatch} from '@hooks/useAppDispatch';

interface RegisterTemplateProps {
  navigation: AppStackNavigationProp<'Register' | 'FirebaseEmailRegister'>;
  registerType: AppRouteProp<'Register' | 'FirebaseEmailRegister'>;
}

const RegisterTemplate = (props: RegisterTemplateProps): React.JSX.Element => {
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
    if (props.registerType.name === 'FirebaseEmailRegister') {
      registerService(
        'firebase',
        {
          emailOrPhone: emailOrPhone,
          password: password,
          confirmPassword: confirmPassword,
        },
        dispatch,
      );
    }
  };

  return (
    <View style={styles.container}>
      <RegisterHeader />
      <RegisterForm
        emailOrPhone={emailOrPhone}
        setEmailOrPhone={setEmailOrPhone}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        showConfirmPassword={showConfirmPassword}
        toggleShowPassword={toggleShowPassword}
        toggleShowConfirmPassword={toggleShowConfirmPassword}
      />
      <RegisterButtons
        navigation={props.navigation}
        registerType={props.registerType}
        onRegister={onRegister}
      />
    </View>
  );
};

export default RegisterTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
