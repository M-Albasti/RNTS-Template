import React from 'react';
import {View} from 'react-native';

import TouchableText from '@atoms/TouchableText';
import {useThemedStyles} from '@theme/createThemedStyles';

interface LoginRegisterButtonProps {
  goToRegister: () => void;
}

const LoginRegisterButton = (props: LoginRegisterButtonProps): React.JSX.Element => {
  const styles = useThemedStyles(t => ({
    textStyle: {color: t.colors.textPrimary},
  }));

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
