import React from 'react';
import {StyleSheet, View} from 'react-native';
import TouchableText from '@atoms/TouchableText';
import {isDarkTheme} from '@theme/appTheme';
import {appColors} from '@constants/colors';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface LoginRegisterButtonProps {
  navigation: AppStackNavigationProp<'Login'>;
}

const LoginRegisterButton = (
  props: LoginRegisterButtonProps,
): React.JSX.Element => {
  return (
    <View>
      <TouchableText
        textStyle={styles.textStyle}
        text={'Register'}
        onPress={() => {
          props.navigation.reset({
            index: 0,
            routes: [{name: 'DrawerRoot'}],
          });
        }}
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
