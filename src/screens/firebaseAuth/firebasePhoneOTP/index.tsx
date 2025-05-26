//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import OTPTemplate from '@templates/auth/otpTemplate';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import {OTPVerificationScreens} from '@Types/otpVerificationScreen';

//* styles import
import {styles} from './styles';

interface FirebasePhoneOTPProps {
  navigation: AppStackNavigationProp<OTPVerificationScreens>;
  route: AppRouteProp<OTPVerificationScreens>;
}

const FirebasePhoneOTP = (props: FirebasePhoneOTPProps) => {
  const {confirmation, loginType} = props.route.params;

  return (
    <View style={styles.container}>
      <OTPTemplate
        navigation={props.navigation}
        confirmation={confirmation}
        loginType={loginType}
      />
    </View>
  );
};

export default FirebasePhoneOTP;
