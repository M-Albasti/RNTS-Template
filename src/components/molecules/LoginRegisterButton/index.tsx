//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import TouchableText from '@atoms/TouchableText';

//* constants import
import {appColors} from '@constants/colors';

//* theme import
import {isDarkTheme} from '@theme/appTheme';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface LoginRegisterButtonProps {
  navigation: AppStackNavigationProp<'Login' | 'FirebaseEmailLogin'>;
  registerType: AppRouteProp<'Register' | 'FirebaseEmailRegister'>;
}

const LoginRegisterButton = (
  props: LoginRegisterButtonProps,
): React.JSX.Element => {
  const goToRegister = () => {
    props.navigation.navigate(props.registerType);
  };

  return (
    <View>
      <TouchableText
        textStyle={styles.textStyle}
        text={'Register'}
        onPress={goToRegister}
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
