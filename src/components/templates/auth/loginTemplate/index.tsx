//* packages import
import React from 'react';
import {KeyboardTypeOptions} from 'react-native';

//* components import
import LoginFooter from '@organisms/auth/login/LoginFooter';
import LoginForm from '@organisms/auth/login/LoginForm';
import LoginHeader from '@organisms/auth/login/LoginHeader';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';

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
    <ScreenContainer scroll centered scrollProps={{keyboardShouldPersistTaps: 'handled'}}>
      <LoginHeader />
      <Spacer size="lg" />
      <LoginForm
        navigation={props.navigation}
        loginType={props.loginType}
        keyboardType={props.keyboardType}
      />
      <Spacer size="md" />
      <LoginFooter
        navigation={props.navigation}
        register={props.register}
        registerType={props.registerType}
      />
    </ScreenContainer>
  );
};

export default LoginTemplate;
