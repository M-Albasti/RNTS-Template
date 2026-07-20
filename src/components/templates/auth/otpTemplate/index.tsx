import React from 'react';
import {useTranslation} from 'react-i18next';

import AuthScreenShell from '@organisms/auth/AuthScreenShell';
import OTPForm from '@organisms/auth/otp/OTPForm';
import OTPFooter from '@organisms/auth/otp/OTPFooter';

import type {ConfirmationResult} from '@Types/firebaseAuthTypes';
import {AppStackNavigationProp} from '@Types/appNavigation';
import {OTPVerificationScreens} from '@Types/otpVerificationScreen';
import {LoginTypes} from '@Types/loginTypes';

interface OTPTemplateProps {
  navigation: AppStackNavigationProp<OTPVerificationScreens>;
  confirmation: ConfirmationResult;
  loginType: LoginTypes;
}

const OTPTemplate = (props: OTPTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <AuthScreenShell
      title={t('auth.phoneVerification')}
      subtitle={t('auth.enterSmsCode')}
      iconName="chatbubble-ellipses-outline"
      footer={<OTPFooter />}>
      <OTPForm
        navigation={props.navigation}
        confirmation={props.confirmation}
        loginType={props.loginType}
      />
    </AuthScreenShell>
  );
};

export default OTPTemplate;
