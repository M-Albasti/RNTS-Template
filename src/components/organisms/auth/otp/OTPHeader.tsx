import React from 'react';

import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

const OTPHeader = (): React.JSX.Element => {
  return (
    <>
      <Heading text="Phone verification" level="h1" align="center" />
      <Spacer size="sm" />
      <TextView
        text="Enter the SMS code to complete sign-in"
        variant="bodySmall"
        muted
        align="center"
      />
    </>
  );
};

export default OTPHeader;
