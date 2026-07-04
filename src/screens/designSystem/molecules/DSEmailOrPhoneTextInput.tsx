import React, {useState} from 'react';

import EmailOrPhoneTextInput from '@molecules/emailOrPhoneTextInput';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

const EmailInputDemo = (): React.JSX.Element => {
  const [value, setValue] = useState('');
  return (
    <EmailOrPhoneTextInput
      emailOrPhone={value}
      setEmailOrPhone={setValue}
      keyboardType="email-address"
    />
  );
};

export default createShowcaseScreen({
  title: 'Email Or Phone Text Input',
  sections: [{title: 'Default', content: <EmailInputDemo />}],
});
