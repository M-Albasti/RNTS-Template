import React from 'react';

import TextView from '@atoms/TextView';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveOtpResendTextStyles} from './styles/resolveOtpResendTextStyles';

interface OTPResendTextProps {
  timer: string | number;
}

const OTPResendText = (props: OTPResendTextProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveOtpResendTextStyles);

  return <TextView text={`Resend code in ${props.timer}s`} style={styles.timerText} />;
};

export default OTPResendText;
