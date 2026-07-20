//* packages import
import React from 'react';
import {useTranslation} from 'react-i18next';

//* components import
import Button from '@atoms/Button';

interface LoginButtonProps {
  onLogin: () => void;
  loading?: boolean;
}

/** Focusify primary CTA — full-width pill. */
const LoginButton = ({onLogin, loading}: LoginButtonProps): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <Button
      label={t('Login')}
      fullWidth
      size="lg"
      onPress={onLogin}
      loading={loading}
    />
  );
};

export default LoginButton;
