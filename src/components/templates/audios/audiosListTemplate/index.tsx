import React from 'react';
import {useTranslation} from 'react-i18next';

import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import ListWithButtons from '@organisms/audios/audiosList/ListWithButtons';

import {sounds} from '@constants/sounds';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AudiosListTemplateProps {
  navigation: AppStackNavigationProp<'AudiosList'>;
}

const AudiosListTemplate = ({
  navigation,
}: AudiosListTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <ScreenContainer>
      <ScreenHeader
        title={t('media.audios')}
        onBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
      <ListWithButtons navigation={navigation} audiosData={sounds} />
    </ScreenContainer>
  );
};

export default AudiosListTemplate;
