import React from 'react';

import RegisterForm from '@organisms/auth/register/RegisterForm';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {
  mockRegisterRoute,
  registerShowcaseNavigation,
} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Register Form',
  sections: [
    {
      title: 'Default',
      content: (
        <RegisterForm
          navigation={registerShowcaseNavigation}
          registerType={mockRegisterRoute}
          keyboardType="email-address"
        />
      ),
    },
  ],
});
