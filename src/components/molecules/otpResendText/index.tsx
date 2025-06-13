//* packages import
import React from 'react';
import {StyleSheet} from 'react-native';

//* components import
import TextView from '@atoms/TextView';

//* constants import
import {appColors} from '@constants/colors';

interface OTPResendTextProps {
  timer: string | number;
}

const OTPResendText = (props: OTPResendTextProps) => {
  return (
    <TextView
      text={`Resend code in ${props.timer}s`}
      style={styles.timerText}
    />
  );
};

export default OTPResendText;

const styles = StyleSheet.create({
  timerText: {
    marginTop: 20,
    color: appColors.gray,
  },
});
