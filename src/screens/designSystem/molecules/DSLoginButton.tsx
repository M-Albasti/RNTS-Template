import React from 'react';

import LoginButton from '@molecules/loginButton';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Login Button',
  sections: [
    {title: 'Default', content: <LoginButton onLogin={() => {}} />},
    {title: 'Loading', content: <LoginButton onLogin={() => {}} loading />},
  ],
});
