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
import {LoginScreens} from '@Types/loginScreens';
import {RegisterScreens} from '@Types/registerScreens';

interface LoginRegisterButtonProps {
  navigation: AppStackNavigationProp<LoginScreens>;
  registerType: AppRouteProp<RegisterScreens>;
}

const LoginRegisterButton = (
  props: LoginRegisterButtonProps,
): React.JSX.Element => {
  const goToRegister = () => {
    props.navigation.navigate(props.registerType.name);
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
