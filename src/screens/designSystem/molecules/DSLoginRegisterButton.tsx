import React from 'react';

import LoginRegisterButton from '@molecules/loginRegisterButton';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Login Register Button',
  sections: [
    {title: 'Default', content: <LoginRegisterButton goToRegister={() => {}} />},
  ],
});
