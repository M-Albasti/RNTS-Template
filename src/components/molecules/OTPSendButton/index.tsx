//* packages import
import React from 'react';
import {StyleSheet} from 'react-native';

//* components import
import TouchableText from '@atoms/TouchableText';

interface OTPSendButtonProps {
  sendOTP: () => void;
  code: string;
}

const OTPSendButton = (props: OTPSendButtonProps) => {
  return (
    <TouchableText
      text={'Verify Code'}
      touchableStyle={styles.sendButton}
      onPress={props.sendOTP}
      disabled={props.code.length != 6}
    />
  );
};

export default OTPSendButton;

const styles = StyleSheet.create({
  sendButton: {
    width: '100%',
    marginTop: 30,
  },
});
