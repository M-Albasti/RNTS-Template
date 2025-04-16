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
import {AppStackNavigationProp} from '@Types/appNavigation';

interface RegisterLoginButtonProps {
  navigation: AppStackNavigationProp<'Register' | 'FirebaseEmailRegister'>;
}

const RegisterLoginButton = (
  props: RegisterLoginButtonProps,
): React.JSX.Element => {
  const goToLogin = () => {
    props.navigation.goBack();
  };

  return (
    <View>
      <TouchableText
        textStyle={styles.textStyle}
        text={'Login'}
        onPress={goToLogin}
      />
    </View>
  );
};

export default RegisterLoginButton;

const styles = StyleSheet.create({
  textStyle: {
    color: isDarkTheme ? appColors.white : appColors.black,
  },
});
