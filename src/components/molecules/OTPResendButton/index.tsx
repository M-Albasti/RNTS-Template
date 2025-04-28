//* packages import
import React from 'react';
import {StyleSheet} from 'react-native';

//* components import
import TouchableText from '@atoms/TouchableText';

interface OTPResendButtonProps {
  resendOTP: () => void;
}

const OTPResendButton = (props: OTPResendButtonProps) => {
  return (
    <TouchableText
      text={'Resend Code'}
      touchableStyle={styles.resendButton}
      onPress={props.resendOTP}
    />
  );
};

export default OTPResendButton;

const styles = StyleSheet.create({
  resendButton: {
    marginTop: 20,
  },
});
