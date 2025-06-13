//* packages import
import React from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

//* components import
import TouchableText from '@atoms/TouchableText';

//* constants import
import {appColors} from '@constants/colors';
//* theme import
import {isDarkTheme} from '@theme/appTheme';

interface LoginButtonProps {
  onLogin: () => void;
}

const LoginButton = (props: LoginButtonProps): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <TouchableText
      textStyle={styles.textStyle}
      text={t('Login')}
      onPress={props.onLogin}
    />
  );
};

export default LoginButton;

const styles = StyleSheet.create({
  textStyle: {
    color: isDarkTheme ? appColors.white : appColors.black,
  },
});
