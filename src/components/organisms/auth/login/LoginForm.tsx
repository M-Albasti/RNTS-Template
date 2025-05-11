//* packages import
import React, {useState} from 'react';
import {KeyboardTypeOptions, StyleSheet, View} from 'react-native';
import {ScreenWidth} from '@rneui/base';

//* components import
import EmailOrPhoneTextInput from '@molecules/EmailOrPhoneTextInput';
import PasswordTextInput from '@molecules/PasswordTextInput';
import LoginButton from '@molecules/LoginButton';

//* services import
import {loginService} from '@services/authServices/loginService';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {LoginScreens} from '@Types/loginScreens';
import {LoginTypes} from '@Types/loginTypes';

interface LoginFormProps {
  navigation: AppStackNavigationProp<LoginScreens>;
  loginType: LoginTypes;
  keyboardType?: KeyboardTypeOptions;
}

const LoginForm = (props: LoginFormProps): React.JSX.Element => {
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onLogin = () => {
    loginService(props.loginType, {emailOrPhone, password}, dispatch);
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
      <LoginButton onLogin={onLogin} />
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
