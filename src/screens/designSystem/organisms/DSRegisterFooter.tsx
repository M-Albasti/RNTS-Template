import React from 'react';

import RegisterFooter from '@organisms/auth/register/RegisterFooter';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {registerShowcaseNavigation} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Register Footer',
  sections: [
    {
      title: 'Default',
      content: <RegisterFooter navigation={registerShowcaseNavigation} />,
    },
  ],
});
