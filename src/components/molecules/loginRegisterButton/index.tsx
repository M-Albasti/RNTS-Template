import React from 'react';
import {View} from 'react-native';

import TouchableText from '@atoms/TouchableText';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveLoginRegisterButtonStyles} from './styles/resolveLoginRegisterButtonStyles';

interface LoginRegisterButtonProps {
  goToRegister: () => void;
}

const LoginRegisterButton = (props: LoginRegisterButtonProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveLoginRegisterButtonStyles);

  return (
    <View>
      <TouchableText
        textStyle={styles.textStyle}
        text={'Register'}
        onPress={props.goToRegister}
      />
    </View>
  );
};

export default LoginRegisterButton;
