import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import EmailOrPhoneTextInput from '@molecules/emailOrPhoneTextInput';

import {useThemedStyles} from '@theme/createThemedStyles';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface ForgetPasswordTemplateProps {
  navigation: AppStackNavigationProp<'ForgetPassword'>;
}

const ForgetPasswordTemplate = ({
  navigation,
}: ForgetPasswordTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const styles = useThemedStyles(tokens => ({
    form: {
      width: '100%' as const,
      maxWidth: 420,
      gap: tokens.spacing.sm,
    },
  }));

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
    <ScreenContainer scroll centered scrollProps={{keyboardShouldPersistTaps: 'handled'}}>
      <Heading text={t('auth.forgotPassword')} level="h1" align="center" />
      <Spacer size="sm" />
      <TextView text={t('auth.resetInstructions')} variant="bodySmall" muted align="center" />
      <Spacer size="lg" />
      <View style={styles.form}>
        <Card>
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
        </Card>
      </View>
    </ScreenContainer>
  );
};

export default ForgetPasswordTemplate;
