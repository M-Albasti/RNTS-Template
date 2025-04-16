//* packages import
import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {z} from 'zod';

//* components import
import LoginHeader from '@organisms/auth/login/LoginHeader';
import LoginForm from '@organisms/auth/login/LoginForm';
import LoginButtons from '@organisms/auth/login/LoginButtons';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

//* utils import
import loginValidation from '@utils/loginValidation';
import {loginService} from '@services/authServices/loginService';
import {useAppDispatch} from '@hooks/useAppDispatch';

interface LoginTemplateProps {
  navigation: AppStackNavigationProp<'Login' | 'FirebaseEmailLogin'>;
  registerType: AppRouteProp<'Register' | 'FirebaseEmailRegister'>;
}

const LoginTemplate = (props: LoginTemplateProps): React.JSX.Element => {
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onLogin = () => {
    loginService('firebase', {emailOrPhone, password}, dispatch);
  };

  return (
    <View style={styles.container}>
      <LoginHeader />
      <LoginForm
        emailOrPhone={emailOrPhone}
        setEmailOrPhone={setEmailOrPhone}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        toggleShowPassword={toggleShowPassword}
      />
      <LoginButtons
        navigation={props.navigation}
        registerType={props.registerType}
        onLogin={onLogin}
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
