import React, {useState} from 'react';
import {Alert, View} from 'react-native';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import OTPTextInput from '@molecules/otpTextInput';

import {useThemedStyles} from '@theme/createThemedStyles';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface MockOtpTemplateProps {
  navigation: AppStackNavigationProp<'OTP'>;
}

const MockOtpTemplate = ({
  navigation,
}: MockOtpTemplateProps): React.JSX.Element => {
  const [code, setCode] = useState('');
  const styles = useThemedStyles(tokens => ({
    form: {
      width: '100%' as const,
      maxWidth: 420,
    },
  }));

  const verifyCode = () => {
    if (code.length < 4) {
      Alert.alert('Validation', 'Enter the verification code.');
      return;
    }
    Alert.alert('Verified', 'Mock OTP accepted.', [
      {text: 'Continue', onPress: () => navigation.navigate('Login')},
    ]);
  };

  return (
    <ScreenContainer scroll centered scrollProps={{keyboardShouldPersistTaps: 'handled'}}>
      <Heading text="Verification code" level="h1" align="center" />
      <Spacer size="sm" />
      <TextView
        text="Enter the code sent to your phone (mock flow uses any 4+ digits)."
        variant="bodySmall"
        muted
        align="center"
      />
      <Spacer size="lg" />
      <View style={styles.form}>
        <Card>
          <OTPTextInput
            onFocus={() => undefined}
            onBlur={() => undefined}
            onTextChange={setCode}
            onFilled={setCode}
          />
          <Spacer size="md" />
          <Button label="Verify" fullWidth onPress={verifyCode} />
          <Spacer size="sm" />
          <Button
            label="Back"
            variant="ghost"
            fullWidth
            onPress={() => navigation.goBack()}
          />
        </Card>
      </View>
    </ScreenContainer>
  );
};

export default MockOtpTemplate;
