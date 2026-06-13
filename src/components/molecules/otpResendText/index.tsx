import React from 'react';

import TextView from '@atoms/TextView';
import {useThemedStyles} from '@theme/createThemedStyles';

interface OTPResendTextProps {
  timer: string | number;
}

const OTPResendText = (props: OTPResendTextProps): React.JSX.Element => {
  const styles = useThemedStyles(t => ({
    timerText: {
      marginTop: 20,
      color: t.colors.textMuted,
    },
  }));

  return <TextView text={`Resend code in ${props.timer}s`} style={styles.timerText} />;
};

export default OTPResendText;
