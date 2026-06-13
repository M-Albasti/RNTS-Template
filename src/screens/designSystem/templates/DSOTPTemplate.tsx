import React from 'react';

import OTPHeader from '@organisms/auth/otp/OTPHeader';
import OTPForm from '@organisms/auth/otp/OTPForm';
import OTPFooter from '@organisms/auth/otp/OTPFooter';
import Spacer from '@atoms/Spacer';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {
  firebasePhoneOtpShowcaseNavigation,
  mockFirebaseConfirmation,
} from '../shared/showcaseHelpers';

const OtpTemplateContent = (): React.JSX.Element => (
  <>
    <OTPHeader />
    <Spacer size="lg" />
    <OTPForm
      navigation={firebasePhoneOtpShowcaseNavigation}
      confirmation={mockFirebaseConfirmation}
      loginType="FirebasePhone"
    />
    <Spacer size="md" />
    <OTPFooter />
  </>
);

export default createShowcaseScreen({
  title: 'OTP Template',
  sections: [{title: 'Firebase OTP flow', content: <OtpTemplateContent />}],
});
