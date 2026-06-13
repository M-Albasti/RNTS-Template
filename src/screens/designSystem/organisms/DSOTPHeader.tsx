import React from 'react';

import OTPHeader from '@organisms/auth/otp/OTPHeader';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'OTP Header',
  sections: [{title: 'Default', content: <OTPHeader />}],
});
