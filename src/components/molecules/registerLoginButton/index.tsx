import React from 'react';
import {View} from 'react-native';

import TouchableText from '@atoms/TouchableText';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveRegisterLoginButtonStyles} from './styles/resolveRegisterLoginButtonStyles';

interface RegisterLoginButtonProps {
  goToLogin: () => void;
}

const RegisterLoginButton = (props: RegisterLoginButtonProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveRegisterLoginButtonStyles);

  return (
    <View>
      <TouchableText textStyle={styles.textStyle} text={'Login'} onPress={props.goToLogin} />
    </View>
  );
};

export default RegisterLoginButton;
