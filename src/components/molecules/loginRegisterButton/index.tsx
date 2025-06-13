//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import TouchableText from '@atoms/TouchableText';

//* constants import
import {appColors} from '@constants/colors';

//* theme import
import {isDarkTheme} from '@theme/appTheme';

interface LoginRegisterButtonProps {
  goToRegister: () => void;
}

const LoginRegisterButton = (
  props: LoginRegisterButtonProps,
): React.JSX.Element => {
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

const styles = StyleSheet.create({
  textStyle: {
    color: isDarkTheme ? appColors.white : appColors.black,
  },
});
