import React from 'react';

import AuthMethodsButtons from '@organisms/authMethod/AuthMethodsButtons';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {authMethodShowcaseNavigation} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Auth Methods Buttons',
  sections: [
    {
      title: 'Default',
      content: (
        <AuthMethodsButtons navigation={authMethodShowcaseNavigation} />
      ),
    },
  ],
});
