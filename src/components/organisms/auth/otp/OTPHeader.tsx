import React from 'react';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

const OTPHeader = (): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <>
      <Heading text={t('auth.phoneVerification')} level="h1" align="center" />
      <Spacer size="sm" />
      <TextView text={t('auth.enterSmsCode')} variant="bodySmall" muted align="center" />
    </>
  );
};

export default OTPHeader;
