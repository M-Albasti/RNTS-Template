import React from 'react';

import LoginHeader from '@organisms/auth/login/LoginHeader';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Login Header',
  sections: [{title: 'Default', content: <LoginHeader />}],
});
