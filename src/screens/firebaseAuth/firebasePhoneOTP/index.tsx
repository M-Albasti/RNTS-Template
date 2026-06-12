//* packages import
import React from 'react';

//* components import
import OTPTemplate from '@templates/auth/otpTemplate';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import {OTPVerificationScreens} from '@Types/otpVerificationScreen';

interface FirebasePhoneOTPProps {
  navigation: AppStackNavigationProp<OTPVerificationScreens>;
  route: AppRouteProp<OTPVerificationScreens>;
}

const FirebasePhoneOTP = ({
  navigation,
  route,
}: FirebasePhoneOTPProps): React.JSX.Element => {
  const {confirmation, loginType} = route.params;

  return (
    <OTPTemplate
      navigation={navigation}
      confirmation={confirmation}
      loginType={loginType}
    />
  );
};

export default FirebasePhoneOTP;
