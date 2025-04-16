//* packages import
import React from 'react';
import {Input, InputProps} from '@rneui/themed';

const TextInputView = (props: InputProps): React.JSX.Element => {
  return <Input {...props} />;
};

export default TextInputView;
