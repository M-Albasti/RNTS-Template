import React from 'react';
import TextInputView from '@atoms/TextInputView';
import type {Dispatch, SetStateAction} from 'react';
import IconView from '@atoms/Icon';

interface EmailOrPhoneTextInputProps {
  emailOrPhone: string;
  setEmailOrPhone: Dispatch<SetStateAction<string>>;
}

const EmailOrPhoneTextInput = (props: EmailOrPhoneTextInputProps) => {
  return (
    <TextInputView
      value={props.emailOrPhone}
      onChangeText={props.setEmailOrPhone}
      leftIcon={<IconView iconType={'Zocial'} name={'email'} size={25} />}
    />
  );
};

export default EmailOrPhoneTextInput;
