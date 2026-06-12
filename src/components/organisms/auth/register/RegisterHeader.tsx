import React from 'react';

import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

const RegisterHeader = (): React.JSX.Element => {
  return (
    <>
      <Heading text="Create account" level="h1" align="center" />
      <Spacer size="sm" />
      <TextView
        text="Register to start using the app"
        variant="bodySmall"
        muted
        align="center"
      />
    </>
  );
};

export default RegisterHeader;
