import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import AuthScreenShell from '@organisms/auth/AuthScreenShell';
import AuthMethodRow from '@molecules/authMethodRow';
import Button from '@atoms/Button';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {resolveLoginOptionsTemplateStyles} from './styles/resolveLoginOptionsTemplateStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface LoginOptionsTemplateProps {
  navigation: AppStackNavigationProp<'LoginOptions'>;
}

/** Focusify welcome: primary CTAs + icon method rows. */
const LoginOptionsTemplate = ({
  navigation,
}: LoginOptionsTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors} = useThemeTokens();
  const styles = useThemedStyles(resolveLoginOptionsTemplateStyles);

  return (
    <AuthScreenShell
      title={t('loginOptions.welcomeTitle')}
      subtitle={t('loginOptions.subtitle')}>
      <Button
        label={t('loginOptions.mockLogin')}
        fullWidth
        size="lg"
        onPress={() => navigation.navigate('Login')}
      />
      <Spacer size="sm" />
      <Button
        label={t('Register')}
        variant="secondary"
        fullWidth
        size="lg"
        onPress={() => navigation.navigate('Register')}
      />

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <TextView text={t('loginOptions.orContinue')} variant="caption" muted />
        <View style={styles.dividerLine} />
      </View>

      <AuthMethodRow
        label={t('loginOptions.firebase')}
        subtitle={t('loginOptions.firebaseSubtitle')}
        iconType="MaterialCommunityIcons"
        iconName="firebase"
        iconColor="#FFA000"
        onPress={() => navigation.navigate('FirebaseAuthStack')}
      />
      <Spacer size="sm" />
      <AuthMethodRow
        label={t('auth.google')}
        subtitle={t('auth.googleSubtitle', {defaultValue: 'Continue with Google'})}
        iconType="AntDesign"
        iconName="google"
        iconColor="#EA4335"
        onPress={() => navigation.navigate('FirebaseAuthStack')}
      />
      <Spacer size="sm" />
      <AuthMethodRow
        label={t('auth.apple')}
        subtitle={t('auth.appleSubtitle', {defaultValue: 'Continue with Apple'})}
        iconType="AntDesign"
        iconName="apple1"
        iconColor={colors.textPrimary}
        onPress={() => navigation.navigate('FirebaseAuthStack')}
      />
      <Spacer size="sm" />
      <AuthMethodRow
        label={t('loginOptions.classicAuthMenu')}
        subtitle={t('loginOptions.signInOptions')}
        iconType="Ionicons"
        iconName="apps-outline"
        iconColor={colors.primary}
        onPress={() => navigation.navigate('AuthMethod')}
      />
      <Spacer size="sm" />
      <AuthMethodRow
        label={t('loginOptions.forgotPasswordTitle')}
        subtitle={t('loginOptions.forgotPasswordSubtitle')}
        iconType="Ionicons"
        iconName="key-outline"
        iconColor={colors.warning}
        onPress={() => navigation.navigate('ForgetPassword')}
      />
    </AuthScreenShell>
  );
};

export default LoginOptionsTemplate;
