import React from 'react';

import RegisterLoginButton from '@molecules/registerLoginButton';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Register Login Button',
  sections: [
    {title: 'Default', content: <RegisterLoginButton goToLogin={() => {}} />},
  ],
});
