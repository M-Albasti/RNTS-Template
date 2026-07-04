import React from 'react';

import OTPResendText from '@molecules/otpResendText';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'OTP Resend Text',
  sections: [{title: 'Timer countdown', content: <OTPResendText timer={45} />}],
});
