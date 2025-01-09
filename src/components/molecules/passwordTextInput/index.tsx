import React from 'react';
import TextInputView from '@atoms/TextInputView';
import type {Dispatch, SetStateAction} from 'react';
import IconView from '@atoms/Icon';
import TouchableIcon from '@atoms/TouchableIcon';

interface PasswordTextInputProps {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  showPassword: boolean;
  toggleShowPassword: () => void;
}

const PasswordTextInput = (props: PasswordTextInputProps) => {
  return (
    <TextInputView
      value={props.password}
      onChangeText={props.setPassword}
      leftIcon={<IconView iconType={'FontAwesome'} name={'lock'} size={25} />}
      secureTextEntry={!props.showPassword}
      rightIcon={
        <TouchableIcon
          iconType={'FontAwesome'}
          name={props.showPassword ? 'eye-slash' : 'eye'}
          onPress={props.toggleShowPassword}
          size={25}
        />
      }
    />
  );
};

export default PasswordTextInput;
