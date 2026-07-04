import React from 'react';

import LoginForm from '@organisms/auth/login/LoginForm';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {loginShowcaseNavigation} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Login Form',
  sections: [
    {
      title: 'Normal login',
      content: (
        <LoginForm
          navigation={loginShowcaseNavigation}
          loginType="Normal"
          keyboardType="email-address"
        />
      ),
    },
  ],
});
