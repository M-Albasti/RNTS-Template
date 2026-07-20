//* packages import
import React from 'react';
import {KeyboardTypeOptions} from 'react-native';
import {useTranslation} from 'react-i18next';

//* components import
import AuthScreenShell from '@organisms/auth/AuthScreenShell';
import LoginFooter from '@organisms/auth/login/LoginFooter';
import LoginForm from '@organisms/auth/login/LoginForm';

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
  const {t} = useTranslation();

  return (
    <AuthScreenShell
      title={t('auth.welcomeBack')}
      subtitle={t('auth.signInSubtitle')}
      iconName="lock-closed-outline"
      footer={
        <LoginFooter
          navigation={props.navigation}
          register={props.register}
          registerType={props.registerType}
        />
      }>
      <LoginForm
        navigation={props.navigation}
        loginType={props.loginType}
        keyboardType={props.keyboardType}
      />
    </AuthScreenShell>
  );
};

export default LoginTemplate;
