import React from 'react';
import {StyleSheet, View} from 'react-native';
import TouchableText from '@atoms/TouchableText';
import {isDarkTheme} from '@theme/appTheme';
import {appColors} from '@constants/colors';

interface LoginButtonProps {
  onLogin: () => void;
}

const LoginButton = (props: LoginButtonProps): React.JSX.Element => {
  return (
    <View>
      <TouchableText
        textStyle={styles.textStyle}
        text={'Login'}
        onPress={() => {
          props.onLogin();
        }}
      />
    </View>
  );
};

export default LoginButton;

const styles = StyleSheet.create({
  textStyle: {
    color: isDarkTheme ? appColors.white : appColors.black,
  },
});
