import React from 'react';

import LoginFooter from '@organisms/auth/login/LoginFooter';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {
  loginShowcaseNavigation,
  mockRegisterRoute,
} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Login Footer',
  sections: [
    {
      title: 'With register link',
      content: (
        <LoginFooter
          navigation={loginShowcaseNavigation}
          register
          registerType={mockRegisterRoute}
        />
      ),
    },
  ],
});
