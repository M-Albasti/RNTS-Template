import React from 'react';

import OTPForm from '@organisms/auth/otp/OTPForm';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {
  firebasePhoneOtpShowcaseNavigation,
  mockFirebaseConfirmation,
} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'OTP Form',
  sections: [
    {
      title: 'Firebase OTP form',
      content: (
        <OTPForm
          navigation={firebasePhoneOtpShowcaseNavigation}
          confirmation={mockFirebaseConfirmation}
          loginType="FirebasePhone"
        />
      ),
    },
  ],
});
