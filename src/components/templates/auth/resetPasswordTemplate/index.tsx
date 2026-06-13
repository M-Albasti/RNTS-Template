import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import PasswordTextInput from '@molecules/passwordTextInput';

import {useThemedStyles} from '@theme/createThemedStyles';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface ResetPasswordTemplateProps {
  navigation: AppStackNavigationProp<'ResetPassword'>;
}

const ResetPasswordTemplate = ({
  navigation,
}: ResetPasswordTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const styles = useThemedStyles(tokens => ({
    form: {
      width: '100%' as const,
      maxWidth: 420,
      gap: tokens.spacing.sm,
    },
    inputs: {
      gap: tokens.spacing.sm,
    },
  }));

  const onResetPassword = () => {
    if (!password || password !== confirmPassword) {
      Alert.alert(t('auth.validationError'), t('auth.passwordsMustMatch'));
      return;
    }
    Alert.alert(t('auth.success'), t('auth.passwordUpdated'), [
      {text: t('auth.goToLogin'), onPress: () => navigation.navigate('Login')},
    ]);
  };

  return (
    <ScreenContainer scroll centered scrollProps={{keyboardShouldPersistTaps: 'handled'}}>
      <Heading text={t('auth.resetPasswordTitle')} level="h1" align="center" />
      <Spacer size="sm" />
      <TextView text={t('auth.resetPasswordHint')} variant="bodySmall" muted align="center" />
      <Spacer size="lg" />
      <View style={styles.form}>
        <Card>
          <View style={styles.inputs}>
            <PasswordTextInput
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(prev => !prev)}
            />
            <PasswordTextInput
              password={confirmPassword}
              setPassword={setConfirmPassword}
              showPassword={showConfirmPassword}
              toggleShowPassword={() => setShowConfirmPassword(prev => !prev)}
            />
          </View>
          <Spacer size="md" />
          <Button label={t('auth.updatePassword')} fullWidth onPress={onResetPassword} />
        </Card>
      </View>
    </ScreenContainer>
  );
};

export default ResetPasswordTemplate;
