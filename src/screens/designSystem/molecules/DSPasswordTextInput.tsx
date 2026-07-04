import React, {useState} from 'react';

import PasswordTextInput from '@molecules/passwordTextInput';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

const PasswordDemo = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <PasswordTextInput
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      toggleShowPassword={() => setShowPassword(prev => !prev)}
    />
  );
};

export default createShowcaseScreen({
  title: 'Password Text Input',
  subtitle: 'Tap eye icon to toggle visibility.',
  sections: [{title: 'With show/hide', content: <PasswordDemo />}],
});
