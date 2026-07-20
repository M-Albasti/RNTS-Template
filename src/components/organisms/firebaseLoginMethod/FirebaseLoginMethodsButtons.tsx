import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import AuthMethodRow from '@molecules/authMethodRow';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';

import {loginService} from '@services/authServices/loginService';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {AppStackNavigationProp} from '@Types/appNavigation';
import {resolveFirebaseLoginMethodsButtonsStyles} from './styles/resolveFirebaseLoginMethodsButtonsStyles';

interface FirebaseLoginMethodsButtonsProps {
  navigation: AppStackNavigationProp<'FirebaseLoginMethod'>;
}

const FirebaseLoginMethodsButtons = ({
  navigation,
}: FirebaseLoginMethodsButtonsProps): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {colors} = useThemeTokens();
  const styles = useThemedStyles(resolveFirebaseLoginMethodsButtonsStyles);

  return (
    <View style={styles.container}>
      <Heading text={t('auth.chooseProvider')} level="h3" align="center" />
      <Spacer size="sm" />
      <AuthMethodRow
        label={t('auth.emailPassword')}
        subtitle={t('auth.emailPasswordSubtitle', {
          defaultValue: 'Sign in with email & password',
        })}
        iconType="Ionicons"
        iconName="mail-outline"
        iconColor={colors.primary}
        onPress={() => navigation.navigate('FirebaseEmailLogin')}
      />
      <AuthMethodRow
        label={t('auth.phoneNumber')}
        subtitle={t('auth.phoneNumberSubtitle', {
          defaultValue: 'OTP via SMS',
        })}
        iconType="Ionicons"
        iconName="call-outline"
        iconColor={colors.success}
        onPress={() => navigation.navigate('FirebasePhoneLogin')}
      />
      <AuthMethodRow
        label={t('auth.google')}
        subtitle={t('auth.googleSubtitle', {defaultValue: 'Continue with Google'})}
        iconType="AntDesign"
        iconName="google"
        iconColor="#EA4335"
        onPress={() => {
          void loginService('FirebaseGoogle', dispatch);
        }}
      />
      <AuthMethodRow
        label={t('auth.facebook')}
        subtitle={t('auth.facebookSubtitle', {
          defaultValue: 'Continue with Facebook',
        })}
        iconType="FontAwesome"
        iconName="facebook"
        iconColor="#1877F2"
        onPress={() => {
          void loginService('FirebaseFacebook', dispatch);
        }}
      />
      <AuthMethodRow
        label={t('auth.apple')}
        subtitle={t('auth.appleSubtitle', {defaultValue: 'Continue with Apple'})}
        iconType="AntDesign"
        iconName="apple1"
        iconColor={colors.textPrimary}
        onPress={() => {
          void loginService('FirebaseApple', dispatch);
        }}
      />
    </View>
  );
};

export default FirebaseLoginMethodsButtons;
