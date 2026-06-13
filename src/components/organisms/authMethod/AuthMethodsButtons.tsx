//* packages import
import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

//* components import
import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AuthMethodsButtonsProps {
  navigation: AppStackNavigationProp<'AuthMethod'>;
}

const AuthMethodsButtons = ({
  navigation,
}: AuthMethodsButtonsProps): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    container: {
      width: '100%' as const,
      maxWidth: 400,
      gap: tokens.spacing.sm,
    },
  }));

  const navigateToFirebaseLogin = () => {
    navigation.navigate('FirebaseAuthStack');
  };

  return (
    <View style={styles.container}>
      <Heading text={t('auth.chooseSignInMethod')} level="h2" align="center" />
      <Spacer size="md" />
      <Button
        label={t('auth.loginWithFirebase')}
        fullWidth
        onPress={navigateToFirebaseLogin}
      />
      <Button
        label={t('auth.mockApiLogin')}
        variant="secondary"
        fullWidth
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        label={t('auth.mockRegister')}
        variant="outline"
        fullWidth
        onPress={() => navigation.navigate('Register')}
      />
      <Button
        label={t('auth.forgotPasswordFlow')}
        variant="ghost"
        fullWidth
        onPress={() => navigation.navigate('ForgetPassword')}
      />
    </View>
  );
};

export default AuthMethodsButtons;
