import React from 'react';

import OTPResendButton from '@molecules/otpResendButton';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'OTP Resend Button',
  sections: [{title: 'Default', content: <OTPResendButton resendOTP={() => {}} />}],
});
