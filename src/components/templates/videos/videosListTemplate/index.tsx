import React from 'react';
import {useTranslation} from 'react-i18next';

import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import ListWithButtons from '@organisms/videos/videosList/ListWithButtons';

import {AppStackNavigationProp} from '@Types/appNavigation';

interface VideosListTemplateProps {
  navigation: AppStackNavigationProp<'VideosList'>;
}

const VideosListTemplate = ({
  navigation,
}: VideosListTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <ScreenContainer>
      <ScreenHeader
        title={t('media.videos')}
        onBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
      <ListWithButtons navigation={navigation} />
    </ScreenContainer>
  );
};

export default VideosListTemplate;
