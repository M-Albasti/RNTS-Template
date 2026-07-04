import React from 'react';
import {View} from 'react-native';

import OTPInput from '@atoms/OTPInput';
import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const OtpSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      <TextView text="4-digit" variant="caption" muted />
      <OTPInput numberOfDigits={4} onTextChange={() => {}} onFilled={() => {}} />
      <TextView text="6-digit" variant="caption" muted />
      <OTPInput numberOfDigits={6} onTextChange={() => {}} onFilled={() => {}} />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'OTP Input',
  sections: [{title: 'Digit lengths', content: <OtpSection />}],
});
