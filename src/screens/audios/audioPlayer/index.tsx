//* packages import
import React from 'react';

//* components import
import AudioPlayerTemplate from '@templates/audios/audioPlayerTemplate';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface AudioPlayerProps {
  navigation: AppStackNavigationProp<'AudioPlayer'>;
  route: AppRouteProp<'AudioPlayer'>;
}

const AudioPlayer = ({navigation, route}: AudioPlayerProps): React.JSX.Element => {
  return (
    <AudioPlayerTemplate
      navigation={navigation}
      audioDetails={route.params.audioDetails}
    />
  );
};

export default AudioPlayer;
