//* packages import
import React from 'react';
import {View, StyleSheet} from 'react-native';

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
  const {confirmation} = props.route.params;

  return (
    <View style={styles.container}>
      <OTPTemplate navigation={props.navigation} confirmation={confirmation} />
    </View>
  );
};

export default FirebasePhoneOTP;
