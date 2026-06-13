import React from 'react';

import AuthMethodsButtons from '@organisms/authMethod/AuthMethodsButtons';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {authMethodShowcaseNavigation} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Auth Method Template',
  sections: [
    {
      title: 'Auth method picker',
      content: <AuthMethodsButtons navigation={authMethodShowcaseNavigation} />,
    },
  ],
});
