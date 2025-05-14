//* packages import
import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {ScreenWidth} from '@rneui/base';

//* components import
import OTPResendText from '@molecules/OTPResendText';
import OTPResendButton from '@molecules/OTPResendButton';

//* services import


//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useCountdown} from '@hooks/useCountdown';

interface OTPFormProps {}

const OTPFooter = (props: OTPFormProps): React.JSX.Element => {
  const timer = useCountdown(60); // Start from 10 seconds
  const dispatch = useAppDispatch();

  const resendOTP = () => {
    try {
      //   setTimer(60);
      // Implement resend logic here using getAuth().signInWithPhoneNumber
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <OTPResendText timer={timer} />
      <OTPResendButton resendOTP={resendOTP} />
    </View>
  );
};

export default OTPFooter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: ScreenWidth,
  },
});
