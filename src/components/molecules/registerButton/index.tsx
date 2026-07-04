import React from 'react';
import {useTranslation} from 'react-i18next';

import TouchableText from '@atoms/TouchableText';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveRegisterButtonStyles} from './styles/resolveRegisterButtonStyles';

import type {AppRouteProp} from '@Types/appNavigation';
import type {RegisterScreens} from '@Types/registerScreens';

interface RegisterButtonProps {
  onRegister: () => void;
  registerType: AppRouteProp<RegisterScreens>;
}

const RegisterButton = (props: RegisterButtonProps): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(resolveRegisterButtonStyles);

  return (
    <TouchableText
      textStyle={styles.textStyle}
      text={t('Register')}
      onPress={props.onRegister}
    />
  );
};

export default RegisterButton;
