import React from 'react';

import OTPText from '@molecules/otpText';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'OTP Text',
  sections: [{title: 'Default', content: <OTPText />}],
});
