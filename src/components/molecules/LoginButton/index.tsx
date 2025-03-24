import React from 'react';
import {StyleSheet, View} from 'react-native';
import TouchableText from '@atoms/TouchableText';
import {isDarkTheme} from '@theme/appTheme';
import {appColors} from '@constants/colors';
import {useTranslation} from 'react-i18next';
import {changeLanguage} from '@translation/i18n';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

interface LoginButtonProps {
  onLogin: () => void;
}

const LoginButton = (props: LoginButtonProps): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const lang = useAppSelector(state => state?.appSettings?.lang);

  return (
    <View>
      <TouchableText
        text={'change language'}
        onPress={() => {
          changeLanguage(lang == 'ar' ? 'en' : 'ar', dispatch);
        }}
      />
      <TouchableText
        textStyle={styles.textStyle}
        text={t('Login')}
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
