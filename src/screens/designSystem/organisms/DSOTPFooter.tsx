import React from 'react';

import OTPFooter from '@organisms/auth/otp/OTPFooter';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'OTP Footer',
  sections: [{title: 'Resend timer and button', content: <OTPFooter />}],
});
