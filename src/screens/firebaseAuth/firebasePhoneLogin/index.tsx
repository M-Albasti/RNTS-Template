//* packages import
import React from 'react';

//* components import
import LoginTemplate from '@templates/auth/loginTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface FirebasePhoneLoginProps {
  navigation: AppStackNavigationProp<'FirebasePhoneLogin'>;
}

const FirebasePhoneLogin = ({
  navigation,
}: FirebasePhoneLoginProps): React.JSX.Element => {
  return (
    <LoginTemplate
      navigation={navigation}
      loginType="FirebasePhone"
      otpVerification
      register={false}
      otpVerificationType="firebasePhoneOTP"
      keyboardType="phone-pad"
    />
  );
};

export default FirebasePhoneLogin;
