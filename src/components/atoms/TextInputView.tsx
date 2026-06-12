//* packages import
import React from 'react';
import {Input, InputProps} from '@rneui/themed';

type TextInputViewProps = Omit<InputProps, 'ref'>;

const TextInputView = (props: TextInputViewProps): React.JSX.Element => {
  return <Input {...props} />;
};

export default TextInputView;
