import React from 'react';

import RegisterHeader from '@organisms/auth/register/RegisterHeader';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Register Header',
  sections: [{title: 'Default', content: <RegisterHeader />}],
});
