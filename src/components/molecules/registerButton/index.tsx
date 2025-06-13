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

//* types import
import {AppRouteProp} from '@Types/appNavigation';
import {RegisterScreens} from '@Types/registerScreens';

interface RegisterButtonProps {
  onRegister: () => void;
  registerType: AppRouteProp<RegisterScreens>;
}

const RegisterButton = (props: RegisterButtonProps): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <TouchableText
      textStyle={styles.textStyle}
      text={t('Register')}
      onPress={props.onRegister}
    />
  );
};

export default RegisterButton;

const styles = StyleSheet.create({
  textStyle: {
    color: isDarkTheme ? appColors.white : appColors.black,
  },
});
