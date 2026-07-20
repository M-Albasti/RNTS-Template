import React from 'react';
import {useTranslation} from 'react-i18next';

import AuthScreenShell from '@organisms/auth/AuthScreenShell';
import Button from '@atoms/Button';
import FirebaseLoginMethodButtons from '@organisms/firebaseLoginMethod/FirebaseLoginMethodsButtons';

import {AppStackNavigationProp} from '@Types/appNavigation';

interface FirebaseLoginMethodTemplateProps {
  navigation: AppStackNavigationProp<'FirebaseLoginMethod'>;
}

const FirebaseLoginMethodTemplate = ({
  navigation,
}: FirebaseLoginMethodTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <AuthScreenShell
      title={t('auth.firebaseSignIn')}
      subtitle={t('loginOptions.firebaseSubtitle')}
      iconName="firebase"
      iconType="MaterialCommunityIcons"
      footer={
        <Button
          label={t('common.goBack')}
          variant="ghost"
          fullWidth
          onPress={() => navigation.goBack()}
        />
      }>
      <FirebaseLoginMethodButtons navigation={navigation} />
    </AuthScreenShell>
  );
};

export default FirebaseLoginMethodTemplate;
