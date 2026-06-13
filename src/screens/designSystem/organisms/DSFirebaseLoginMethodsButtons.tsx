import React from 'react';

import FirebaseLoginMethodsButtons from '@organisms/firebaseLoginMethod/FirebaseLoginMethodsButtons';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {firebaseLoginMethodShowcaseNavigation} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Firebase Login Methods',
  sections: [
    {
      title: 'Provider buttons',
      content: (
        <FirebaseLoginMethodsButtons
          navigation={firebaseLoginMethodShowcaseNavigation}
        />
      ),
    },
  ],
});
