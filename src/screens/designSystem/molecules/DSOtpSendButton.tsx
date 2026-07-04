import React from 'react';
import {View} from 'react-native';

import OTPSendButton from '@molecules/otpSendButton';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const SendButtonSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      <OTPSendButton sendOTP={() => {}} code="123456" />
      <OTPSendButton sendOTP={() => {}} code="12" />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'OTP Send Button',
  subtitle: 'Second example has incomplete code (disabled).',
  sections: [{title: 'Enabled and disabled', content: <SendButtonSection />}],
});
