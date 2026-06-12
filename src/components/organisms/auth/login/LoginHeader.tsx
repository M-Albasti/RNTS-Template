//* packages import
import React from 'react';

//* components import
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

const LoginHeader = (): React.JSX.Element => {
  return (
    <>
      <Heading text="Welcome back" level="h1" align="center" />
      <Spacer size="sm" />
      <TextView
        text="Sign in to continue to your account"
        variant="bodySmall"
        muted
        align="center"
      />
    </>
  );
};

export default LoginHeader;
