//* packages import
import React from 'react';
import {View} from 'react-native';

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
      <Heading text="Choose sign-in method" level="h2" align="center" />
      <Spacer size="md" />
      <Button label="Login with Firebase" fullWidth onPress={navigateToFirebaseLogin} />
      <Button
        label="Mock API login"
        variant="secondary"
        fullWidth
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        label="Mock register"
        variant="outline"
        fullWidth
        onPress={() => navigation.navigate('Register')}
      />
      <Button
        label="Forgot password flow"
        variant="ghost"
        fullWidth
        onPress={() => navigation.navigate('ForgetPassword')}
      />
    </View>
  );
};

export default AuthMethodsButtons;
