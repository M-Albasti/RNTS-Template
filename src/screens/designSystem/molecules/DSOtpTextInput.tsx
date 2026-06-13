import React from 'react';

import OTPTextInput from '@molecules/otpTextInput';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'OTP Text Input',
  sections: [
    {
      title: '6-digit input',
      content: (
        <OTPTextInput
          onFocus={() => {}}
          onBlur={() => {}}
          onTextChange={() => {}}
          onFilled={() => {}}
        />
      ),
    },
  ],
});
