import React from 'react';
import {KeyboardTypeOptions} from 'react-native';
import {useTranslation} from 'react-i18next';

import AuthScreenShell from '@organisms/auth/AuthScreenShell';
import RegisterFooter from '@organisms/auth/register/RegisterFooter';
import RegisterForm from '@organisms/auth/register/RegisterForm';

import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import {RegisterScreens} from '@Types/registerScreens';

interface RegisterTemplateProps {
  navigation: AppStackNavigationProp<RegisterScreens>;
  registerType: AppRouteProp<RegisterScreens>;
  keyboardType?: KeyboardTypeOptions;
}

const RegisterTemplate = (props: RegisterTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <AuthScreenShell
      title={t('Register')}
      subtitle={t('auth.registerSubtitle')}
      iconName="person-add-outline"
      footer={<RegisterFooter navigation={props.navigation} />}>
      <RegisterForm
        navigation={props.navigation}
        registerType={props.registerType}
        keyboardType={props.keyboardType}
      />
    </AuthScreenShell>
  );
};

export default RegisterTemplate;
