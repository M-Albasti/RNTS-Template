import React from 'react';

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
  return (
    <ScreenContainer>
      <ScreenHeader
        title="Videos"
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
