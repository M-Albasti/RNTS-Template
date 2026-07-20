import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

import AuthScreenShell from '@organisms/auth/AuthScreenShell';
import Button from '@atoms/Button';
import Spacer from '@atoms/Spacer';
import EmailOrPhoneTextInput from '@molecules/emailOrPhoneTextInput';

import {AppStackNavigationProp} from '@Types/appNavigation';

interface ForgetPasswordTemplateProps {
  navigation: AppStackNavigationProp<'ForgetPassword'>;
}

const ForgetPasswordTemplate = ({
  navigation,
}: ForgetPasswordTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const onSendResetLink = () => {
    if (!emailOrPhone.trim()) {
      Alert.alert(t('auth.validationError'), t('auth.enterEmailOrPhone'));
      return;
    }
    Alert.alert(t('auth.resetLinkSent'), t('auth.resetLinkSentMessage'), [
      {
        text: t('auth.continue'),
        onPress: () => navigation.navigate('ResetPassword'),
      },
    ]);
  };

  return (
    <AuthScreenShell
      title={t('auth.forgotPassword')}
      subtitle={t('auth.resetInstructions')}
      iconName="key-outline">
      <EmailOrPhoneTextInput
        emailOrPhone={emailOrPhone}
        setEmailOrPhone={setEmailOrPhone}
        keyboardType="email-address"
      />
      <Spacer size="md" />
      <Button label={t('auth.sendResetLink')} fullWidth onPress={onSendResetLink} />
      <Spacer size="sm" />
      <Button
        label={t('auth.backToLogin')}
        variant="ghost"
        fullWidth
        onPress={() => navigation.goBack()}
      />
    </AuthScreenShell>
  );
};

export default ForgetPasswordTemplate;
