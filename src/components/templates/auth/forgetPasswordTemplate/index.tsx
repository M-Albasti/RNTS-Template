import React, {useState} from 'react';
import {Alert, View} from 'react-native';

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
      Alert.alert('Validation', 'Please enter your email or phone number.');
      return;
    }
    Alert.alert(
      'Reset link sent',
      'This is a mock flow. Continue to set a new password.',
      [
        {
          text: 'Continue',
          onPress: () => navigation.navigate('ResetPassword'),
        },
      ],
    );
  };

  return (
    <ScreenContainer scroll centered scrollProps={{keyboardShouldPersistTaps: 'handled'}}>
      <Heading text="Forgot password?" level="h1" align="center" />
      <Spacer size="sm" />
      <TextView
        text="Enter your email or phone and we will send reset instructions."
        variant="bodySmall"
        muted
        align="center"
      />
      <Spacer size="lg" />
      <View style={styles.form}>
        <Card>
          <EmailOrPhoneTextInput
            emailOrPhone={emailOrPhone}
            setEmailOrPhone={setEmailOrPhone}
            keyboardType="email-address"
          />
          <Spacer size="md" />
          <Button label="Send reset link" fullWidth onPress={onSendResetLink} />
          <Spacer size="sm" />
          <Button
            label="Back to login"
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
