import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

import AuthScreenShell from '@organisms/auth/AuthScreenShell';
import Button from '@atoms/Button';
import Spacer from '@atoms/Spacer';
import OTPTextInput from '@molecules/otpTextInput';

import {AppStackNavigationProp} from '@Types/appNavigation';

interface MockOtpTemplateProps {
  navigation: AppStackNavigationProp<'OTP'>;
}

const MockOtpTemplate = ({
  navigation,
}: MockOtpTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();
  const [code, setCode] = useState('');

  const verifyCode = () => {
    if (code.length < 4) {
      Alert.alert(t('auth.validationError'), t('auth.enterVerificationCode'));
      return;
    }
    Alert.alert(t('auth.otpVerified'), t('auth.otpVerifiedMessage'), [
      {text: t('auth.continue'), onPress: () => navigation.navigate('Login')},
    ]);
  };

  return (
    <AuthScreenShell
      title={t('auth.verificationCode')}
      subtitle={t('auth.otpHint')}
      iconName="keypad-outline">
      <OTPTextInput
        onFocus={() => undefined}
        onBlur={() => undefined}
        onTextChange={setCode}
        onFilled={setCode}
      />
      <Spacer size="md" />
      <Button label={t('auth.verify')} fullWidth onPress={verifyCode} />
      <Spacer size="sm" />
      <Button
        label={t('common.goBack')}
        variant="ghost"
        fullWidth
        onPress={() => navigation.goBack()}
      />
    </AuthScreenShell>
  );
};

export default MockOtpTemplate;
