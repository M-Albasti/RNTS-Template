//* packages import
import React from 'react';
import {useTranslation} from 'react-i18next';

//* components import
import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface NotFoundProps {
  navigation: AppStackNavigationProp<'NotFound'>;
}

const NotFound = ({navigation}: NotFoundProps): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <ScreenContainer centered alignContent="center">
      <Heading text={t('navigation.notFoundCode')} level="display" tone="primary" align="center" />
      <Spacer size="sm" />
      <Heading text={t('navigation.pageNotFound')} level="h2" tone="muted" align="center" />
      <Spacer size="md" />
      <TextView
        text={t('navigation.pageNotFoundMessage')}
        variant="body"
        muted
        align="center"
      />
      <Spacer size="xl" />
      <Button
        label={t('common.goBack')}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
    </ScreenContainer>
  );
};

export default NotFound;
