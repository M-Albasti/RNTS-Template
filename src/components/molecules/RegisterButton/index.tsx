//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

//* components import
import TouchableText from '@atoms/TouchableText';

//* constants import
import {appColors} from '@constants/colors';
//* theme import
import {isDarkTheme} from '@theme/appTheme';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

//* translation import
import {changeLanguage} from '@translation/i18n';
import {AppRouteProp} from '@Types/appNavigation';

interface RegisterButtonProps {
  onRegister: () => void;
  registerType: AppRouteProp<'Register' | 'FirebaseEmailRegister'>;
}

const RegisterButton = (props: RegisterButtonProps): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const lang = useAppSelector(state => state?.appSettings?.lang);
  // console.log('🚀 ~ registerType:', props.registerType);

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
        text={t('Register')}
        onPress={() => {
          props.onRegister();
        }}
      />
    </View>
  );
};

export default RegisterButton;

const styles = StyleSheet.create({
  textStyle: {
    color: isDarkTheme ? appColors.white : appColors.black,
  },
});
