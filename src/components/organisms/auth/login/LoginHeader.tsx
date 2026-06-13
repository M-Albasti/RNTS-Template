//* packages import
import React from 'react';
import {useTranslation} from 'react-i18next';

//* components import
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

const LoginHeader = (): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <>
      <Heading text={t('auth.welcomeBack')} level="h1" align="center" />
      <Spacer size="sm" />
      <TextView
        text={t('auth.signInSubtitle')}
        variant="bodySmall"
        muted
        align="center"
      />
    </>
  );
};

export default LoginHeader;
