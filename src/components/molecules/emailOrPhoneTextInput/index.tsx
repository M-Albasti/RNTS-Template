import React from 'react';
import {KeyboardTypeOptions} from 'react-native';
import {useTranslation} from 'react-i18next';

import TextInputView from '@atoms/TextInputView';
import IconView from '@atoms/Icon';

import {useThemeTokens} from '@theme/useThemeTokens';
import type {Dispatch, SetStateAction} from 'react';

interface EmailOrPhoneTextInputProps {
  emailOrPhone: string;
  setEmailOrPhone: Dispatch<SetStateAction<string>>;
  keyboardType?: KeyboardTypeOptions;
  label?: string;
  placeholder?: string;
}

const EmailOrPhoneTextInput = (props: EmailOrPhoneTextInputProps) => {
  const {t} = useTranslation();
  const {colors} = useThemeTokens();

  return (
    <TextInputView
      label={props.label ?? t('auth.emailLabel')}
      value={props.emailOrPhone}
      onChangeText={props.setEmailOrPhone}
      placeholder={props.placeholder ?? t('auth.emailPlaceholder')}
      keyboardType={props.keyboardType ?? 'email-address'}
      autoCapitalize="none"
      autoCorrect={false}
      leftIcon={
        <IconView
          iconType="Ionicons"
          name="mail-outline"
          size={20}
          color={colors.textMuted}
        />
      }
    />
  );
};

export default EmailOrPhoneTextInput;
