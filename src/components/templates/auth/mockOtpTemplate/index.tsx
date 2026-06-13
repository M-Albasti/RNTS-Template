import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();
  const [code, setCode] = useState('');
  const styles = useThemedStyles(tokens => ({
    form: {
      width: '100%' as const,
      maxWidth: 420,
    },
  }));

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
    <ScreenContainer scroll centered scrollProps={{keyboardShouldPersistTaps: 'handled'}}>
      <Heading text={t('auth.verificationCode')} level="h1" align="center" />
      <Spacer size="sm" />
      <TextView text={t('auth.otpHint')} variant="bodySmall" muted align="center" />
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
          <Button label={t('auth.verify')} fullWidth onPress={verifyCode} />
          <Spacer size="sm" />
          <Button
            label={t('common.goBack')}
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
