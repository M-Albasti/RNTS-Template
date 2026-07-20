import React from 'react';
import {useTranslation} from 'react-i18next';

import TextInputView from '@atoms/TextInputView';
import IconView from '@atoms/Icon';
import TouchableIcon from '@atoms/TouchableIcon';

import {useThemeTokens} from '@theme/useThemeTokens';
import type {Dispatch, SetStateAction} from 'react';

interface PasswordTextInputProps {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  showPassword: boolean;
  toggleShowPassword: () => void;
  label?: string;
  placeholder?: string;
}

const PasswordTextInput = (props: PasswordTextInputProps) => {
  const {t} = useTranslation();
  const {colors} = useThemeTokens();

  return (
    <TextInputView
      label={props.label ?? t('auth.passwordLabel')}
      value={props.password}
      onChangeText={props.setPassword}
      placeholder={props.placeholder ?? t('auth.passwordPlaceholder')}
      secureTextEntry={!props.showPassword}
      autoCapitalize="none"
      autoCorrect={false}
      leftIcon={
        <IconView
          iconType="Ionicons"
          name="lock-closed-outline"
          size={20}
          color={colors.textMuted}
        />
      }
      rightIcon={
        <TouchableIcon
          iconType="Ionicons"
          name={props.showPassword ? 'eye-off-outline' : 'eye-outline'}
          onPress={props.toggleShowPassword}
          size={20}
          color={colors.textMuted}
        />
      }
    />
  );
};

export default PasswordTextInput;
