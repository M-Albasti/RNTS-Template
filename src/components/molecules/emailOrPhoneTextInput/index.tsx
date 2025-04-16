//* packages import
import React from 'react';

//* components import
import TextInputView from '@atoms/TextInputView';
import IconView from '@atoms/Icon';

//* types import
import type {Dispatch, SetStateAction} from 'react';

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
