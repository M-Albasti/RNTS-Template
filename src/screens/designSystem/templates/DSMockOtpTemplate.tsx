import React, {useState} from 'react';
import {View} from 'react-native';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import OTPTextInput from '@molecules/otpTextInput';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useThemedStyles} from '@theme/createThemedStyles';

const MockOtpContent = (): React.JSX.Element => {
  const [code, setCode] = useState('');
  const styles = useThemedStyles(tokens => ({
    form: {width: '100%' as const, maxWidth: 420},
  }));

  return (
    <>
      <Heading text="Verification code" level="h1" align="center" />
      <Spacer size="sm" />
      <TextView text="Enter the mock OTP sent to your device." variant="bodySmall" muted align="center" />
      <Spacer size="lg" />
      <View style={styles.form}>
        <Card>
          <OTPTextInput
            onFocus={() => {}}
            onBlur={() => {}}
            onTextChange={setCode}
            onFilled={setCode}
          />
          <Spacer size="md" />
          <Button label="Verify" fullWidth onPress={() => {}} />
          <Spacer size="sm" />
          <Button label="Go back" variant="ghost" fullWidth onPress={() => {}} />
        </Card>
      </View>
    </>
  );
};

export default createShowcaseScreen({
  title: 'Mock OTP Template',
  sections: [{title: 'Mock verification', content: <MockOtpContent />}],
});
