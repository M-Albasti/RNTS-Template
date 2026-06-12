//* packages import
import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

//* components import
import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Spacer from '@atoms/Spacer';

interface LoginButtonProps {
  onLogin: () => void;
  loading?: boolean;
}

/** Wraps themed Button — replaces TouchableText + manual dark/light colors. */
const LoginButton = ({onLogin, loading}: LoginButtonProps): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <View>
      <Spacer size="md" />
      <Button label={t('Login')} fullWidth onPress={onLogin} loading={loading} />
    </View>
  );
};

export default LoginButton;
