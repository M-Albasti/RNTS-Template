import React from 'react';

import ScreenContainer from '@atoms/ScreenContainer';
import AudioPlayerView from '@organisms/audios/audioPlayer/AudioPlayerView';

import {AppStackNavigationProp} from '@Types/appNavigation';
import {SoundProps} from '@Types/soundProps';

interface AudioPlayerTemplateProps {
  navigation: AppStackNavigationProp<'AudioPlayer'>;
  audioDetails: SoundProps;
}

const AudioPlayerTemplate = ({
  navigation,
  audioDetails,
}: AudioPlayerTemplateProps): React.JSX.Element => {
  return (
    <ScreenContainer>
      <AudioPlayerView navigation={navigation} audioDetails={audioDetails} />
    </ScreenContainer>
  );
};

export default AudioPlayerTemplate;
