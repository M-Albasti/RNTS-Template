import React, {useState} from 'react';
import {View} from 'react-native';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import EmailOrPhoneTextInput from '@molecules/emailOrPhoneTextInput';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useThemedStyles} from '@theme/createThemedStyles';

const ForgetPasswordContent = (): React.JSX.Element => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const styles = useThemedStyles(tokens => ({
    form: {width: '100%' as const, maxWidth: 420, gap: tokens.spacing.sm},
  }));

  return (
    <>
      <Heading text="Forgot password" level="h1" align="center" />
      <Spacer size="sm" />
      <TextView text="Enter email or phone to receive a reset link." variant="bodySmall" muted align="center" />
      <Spacer size="lg" />
      <View style={styles.form}>
        <Card>
          <EmailOrPhoneTextInput
            emailOrPhone={emailOrPhone}
            setEmailOrPhone={setEmailOrPhone}
            keyboardType="email-address"
          />
          <Spacer size="md" />
          <Button label="Send reset link" fullWidth onPress={() => {}} />
          <Spacer size="sm" />
          <Button label="Back to login" variant="ghost" fullWidth onPress={() => {}} />
        </Card>
      </View>
    </>
  );
};

export default createShowcaseScreen({
  title: 'Forget Password Template',
  sections: [{title: 'Reset request form', content: <ForgetPasswordContent />}],
});
