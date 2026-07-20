//* packages import
import React from 'react';
import {useTranslation} from 'react-i18next';

//* components import
import AuthScreenShell from '@organisms/auth/AuthScreenShell';
import AuthMethodButtons from '@organisms/authMethod/AuthMethodsButtons';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AuthMethodTemplateProps {
  navigation: AppStackNavigationProp<'AuthMethod'>;
}

const AuthMethodTemplate = ({
  navigation,
}: AuthMethodTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <AuthScreenShell
      title={t('auth.chooseSignInMethod')}
      subtitle={t('loginOptions.subtitle')}
      iconName="apps-outline">
      <AuthMethodButtons navigation={navigation} />
    </AuthScreenShell>
  );
};

export default AuthMethodTemplate;
