import React, {useState} from 'react';
import {Alert, View} from 'react-native';

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
      Alert.alert('Validation', 'Passwords must match and not be empty.');
      return;
    }
    Alert.alert('Success', 'Password updated (mock flow).', [
      {text: 'Go to login', onPress: () => navigation.navigate('Login')},
    ]);
  };

  return (
    <ScreenContainer scroll centered scrollProps={{keyboardShouldPersistTaps: 'handled'}}>
      <Heading text="Reset password" level="h1" align="center" />
      <Spacer size="sm" />
      <TextView
        text="Choose a strong new password for your account."
        variant="bodySmall"
        muted
        align="center"
      />
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
          <Button label="Update password" fullWidth onPress={onResetPassword} />
        </Card>
      </View>
    </ScreenContainer>
  );
};

export default ResetPasswordTemplate;
