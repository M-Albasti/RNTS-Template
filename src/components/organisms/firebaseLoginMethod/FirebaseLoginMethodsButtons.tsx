import React from 'react';
import {View} from 'react-native';

import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';

import {loginService} from '@services/authServices/loginService';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useThemedStyles} from '@theme/createThemedStyles';
import {AppStackNavigationProp} from '@Types/appNavigation';
import { logger } from 'src/utils/logger';

interface FirebaseLoginMethodsButtonsProps {
  navigation: AppStackNavigationProp<'FirebaseLoginMethod'>;
}

const FirebaseLoginMethodsButtons = ({
  navigation,
}: FirebaseLoginMethodsButtonsProps): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const navigateToEmailLogin = () => {
    // Replace with your navigation logic
    logger.info('Navigate to Email Login');
    navigation.navigate('FirebaseEmailLogin');
  };

  const navigateToPhoneLogin = () => {
    // Replace with your navigation logic
    logger.info('Navigate to Phone Login');
    navigation.navigate('FirebasePhoneLogin');
  };

  const navigateToFacebookLogin = () => {
    // Replace with your navigation logic
    loginService('FirebaseFacebook', dispatch);
    logger.info('Navigate to Facebook Login');
  };

  const navigateToGoogleLogin = () => {
    // Replace with your navigation logic
    loginService('FirebaseGoogle', dispatch);
    logger.info('Navigate to Google Login');
  };

  const navigateToAppleLogin = () => {
    // Replace with your navigation logic
    loginService('FirebaseApple', dispatch);
    logger.info('Navigate to Apple Login');
  };

  const styles = useThemedStyles(tokens => ({
    container: {
      width: '100%' as const,
      gap: tokens.spacing.sm,
    },
  }));

  return (
    <View style={styles.container}>
      <Heading text="Choose provider" level="h3" align="center" />
      <Spacer size="sm" />
      <Button
        label="Email & password"
        fullWidth
        onPress={navigateToEmailLogin}
      />
      <Button
        label="Phone number"
        variant="secondary"
        fullWidth
        onPress={navigateToPhoneLogin}
      />
      <Button
        label="Google"
        variant="outline"
        fullWidth
        onPress={navigateToGoogleLogin}
      />
      <Button
        label="Facebook"
        variant="outline"
        fullWidth
        onPress={navigateToFacebookLogin}
      />
      <Button
        label="Apple"
        variant="outline"
        fullWidth
        onPress={navigateToAppleLogin}
      />
    </View>
  );
};

export default FirebaseLoginMethodsButtons;
