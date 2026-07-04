import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import AudioPlayerView from '@organisms/audios/audioPlayer/AudioPlayerView';

import {useAudioView} from '@hooks/useAudioView';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveAudioPlayerTemplateStyles} from './styles/resolveAudioPlayerTemplateStyles';
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
  const {t} = useTranslation();
  const {
    isPlaying,
    loadError,
    repeat,
    currentTime,
    duration,
    playSound,
    pauseSound,
    stopSound,
    repeatSound,
    onSeekSound,
  } = useAudioView(audioDetails);

  const styles = useThemedStyles(resolveAudioPlayerTemplateStyles);

  return (
    <ScreenContainer>
      <ScreenHeader
        title={audioDetails.title || t('media.nowPlaying')}
        onBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
      <Spacer size="md" />
      <View style={styles.playerCard}>
        <AudioPlayerView
          audioDetails={audioDetails}
          loadError={loadError}
          isPlaying={isPlaying}
          repeat={repeat}
          currentTime={currentTime}
          duration={duration}
          playSound={playSound}
          pauseSound={pauseSound}
          stopSound={stopSound}
          repeatSound={repeatSound}
          onSeekSound={onSeekSound}
        />
      </View>
    </ScreenContainer>
  );
};

export default AudioPlayerTemplate;
