import React, {useState} from 'react';
import {View} from 'react-native';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import PasswordTextInput from '@molecules/passwordTextInput';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveDSResetPasswordTemplateStyles} from './styles/resolveDSResetPasswordTemplateStyles';

const ResetPasswordContent = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const styles = useThemedStyles(resolveDSResetPasswordTemplateStyles);

  return (
    <>
      <Heading text="Reset password" level="h1" align="center" />
      <Spacer size="sm" />
      <TextView text="Choose a new password for your account." variant="bodySmall" muted align="center" />
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
              showPassword={showConfirm}
              toggleShowPassword={() => setShowConfirm(prev => !prev)}
            />
          </View>
          <Spacer size="md" />
          <Button label="Update password" fullWidth onPress={() => {}} />
        </Card>
      </View>
    </>
  );
};

export default createShowcaseScreen({
  title: 'Reset Password Template',
  sections: [{title: 'New password form', content: <ResetPasswordContent />}],
});
