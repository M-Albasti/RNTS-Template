//* packages import
import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

//* components import
import AuthMethodRow from '@molecules/authMethodRow';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {resolveAuthMethodsButtonsStyles} from './styles/resolveAuthMethodsButtonsStyles';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AuthMethodsButtonsProps {
  navigation: AppStackNavigationProp<'AuthMethod'>;
}

const AuthMethodsButtons = ({
  navigation,
}: AuthMethodsButtonsProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors} = useThemeTokens();
  const styles = useThemedStyles(resolveAuthMethodsButtonsStyles);

  return (
    <View style={styles.container}>
      <AuthMethodRow
        label={t('auth.loginWithFirebase')}
        subtitle={t('loginOptions.firebaseSubtitle')}
        iconType="MaterialCommunityIcons"
        iconName="firebase"
        iconColor="#FFA000"
        onPress={() => navigation.navigate('FirebaseAuthStack')}
      />
      <AuthMethodRow
        label={t('auth.mockApiLogin')}
        subtitle={t('loginOptions.mockLoginSubtitle')}
        iconType="Ionicons"
        iconName="mail-outline"
        iconColor={colors.primary}
        onPress={() => navigation.navigate('Login')}
      />
      <AuthMethodRow
        label={t('auth.mockRegister')}
        subtitle={t('loginOptions.registerSubtitle')}
        iconType="Ionicons"
        iconName="person-add-outline"
        iconColor={colors.success}
        onPress={() => navigation.navigate('Register')}
      />
      <AuthMethodRow
        label={t('auth.forgotPasswordFlow')}
        subtitle={t('loginOptions.forgotPasswordSubtitle')}
        iconType="Ionicons"
        iconName="key-outline"
        iconColor={colors.warning}
        onPress={() => navigation.navigate('ForgetPassword')}
      />
    </View>
  );
};

export default AuthMethodsButtons;
