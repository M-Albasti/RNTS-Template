import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import FirebaseLoginMethodButtons from '@organisms/firebaseLoginMethod/FirebaseLoginMethodsButtons';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveFirebaseLoginMethodTemplateStyles} from './styles/resolveFirebaseLoginMethodTemplateStyles';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface FirebaseLoginMethodTemplateProps {
  navigation: AppStackNavigationProp<'FirebaseLoginMethod'>;
}

const FirebaseLoginMethodTemplate = ({
  navigation,
}: FirebaseLoginMethodTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(resolveFirebaseLoginMethodTemplateStyles);

  return (
    <ScreenContainer scroll centered alignContent="center">
      <Heading text={t('auth.firebaseSignIn')} level="h1" align="center" />
      <Spacer size="sm" />
      <View style={styles.wrap}>
        <FirebaseLoginMethodButtons navigation={navigation} />
        <Spacer size="md" />
        <Button
          label={t('common.goBack')}
          variant="ghost"
          fullWidth
          onPress={() => navigation.goBack()}
        />
      </View>
    </ScreenContainer>
  );
};

export default FirebaseLoginMethodTemplate;
