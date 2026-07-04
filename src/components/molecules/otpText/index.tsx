import React from 'react';
import {View} from 'react-native';

import TextView from '@atoms/TextView';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveOtpTextStyles} from './styles/resolveOtpTextStyles';

const OTPText = (): React.JSX.Element => {
  const styles = useThemedStyles(resolveOtpTextStyles);

  return (
    <View>
      <TextView text={'Enter Verification Code'} style={styles.title} />
      <TextView
        text={'We have sent you a 6 digit verification code'}
        style={styles.subtitle}
      />
    </View>
  );
};

export default OTPText;
