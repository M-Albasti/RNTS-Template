import React from 'react';

import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import OTPHeader from '@organisms/auth/otp/OTPHeader';
import OTPForm from '@organisms/auth/otp/OTPForm';
import OTPFooter from '@organisms/auth/otp/OTPFooter';

import type {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {AppStackNavigationProp} from '@Types/appNavigation';
import {OTPVerificationScreens} from '@Types/otpVerificationScreen';
import {LoginTypes} from '@Types/loginTypes';

interface OTPTemplateProps {
  navigation: AppStackNavigationProp<OTPVerificationScreens>;
  confirmation: FirebaseAuthTypes.ConfirmationResult;
  loginType: LoginTypes;
}

const OTPTemplate = (props: OTPTemplateProps): React.JSX.Element => {
  return (
    <ScreenContainer scroll centered scrollProps={{keyboardShouldPersistTaps: 'handled'}}>
      <OTPHeader />
      <Spacer size="lg" />
      <OTPForm
        navigation={props.navigation}
        confirmation={props.confirmation}
        loginType={props.loginType}
      />
      <Spacer size="md" />
      <OTPFooter />
    </ScreenContainer>
  );
};

export default OTPTemplate;
