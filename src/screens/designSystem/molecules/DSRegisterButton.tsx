import React from 'react';

import RegisterButton from '@molecules/registerButton';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {mockRegisterRoute} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Register Button',
  sections: [
    {
      title: 'Default',
      content: (
        <RegisterButton
          onRegister={() => {}}
          registerType={mockRegisterRoute}
        />
      ),
    },
  ],
});
