import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import AuthScreenShell from '@organisms/auth/AuthScreenShell';
import Button from '@atoms/Button';
import Spacer from '@atoms/Spacer';
import PasswordTextInput from '@molecules/passwordTextInput';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveResetPasswordTemplateStyles} from './styles/resolveResetPasswordTemplateStyles';
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
  const styles = useThemedStyles(resolveResetPasswordTemplateStyles);

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
    <AuthScreenShell
      title={t('auth.resetPasswordTitle')}
      subtitle={t('auth.resetPasswordHint')}
      iconName="shield-checkmark-outline">
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
      <Spacer size="sm" />
      <Button
        label={t('auth.backToLogin')}
        variant="ghost"
        fullWidth
        onPress={() => navigation.navigate('Login')}
      />
    </AuthScreenShell>
  );
};

export default ResetPasswordTemplate;
