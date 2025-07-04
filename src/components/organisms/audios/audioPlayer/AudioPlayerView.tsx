//* packages import
import React, { memo } from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import AudioHeader from '@molecules/audios/audioPlayer/audioHeader';
import AudioContent from '@molecules/audios/audioPlayer/audioContent';
import AudioProgressBar from '@molecules/audios/audioPlayer/audioProgressBar';
import AudioControllers from '@molecules/audios/audioPlayer/audioControllers';

//* hooks import
import {useAudioView} from '@hooks/useAudioView';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {SoundProps} from '@Types/soundProps';

interface AudioPlayerViewProps {
  navigation: AppStackNavigationProp<'AudioPlayer'>;
  audioDetails: SoundProps;
}

const AudioPlayerView = memo((props: AudioPlayerViewProps) => {
  const {
    isPlaying,
    repeat,
    currentTime,
    duration,
    playSound,
    pauseSound,
    stopSound,
    repeatSound,
    onSeekSound,
  } = useAudioView(props.audioDetails);

  return (
    <View style={styles.container}>
      <AudioHeader navigation={props.navigation} />
      <AudioContent audioDetails={props.audioDetails} />
      <AudioProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeekSound={onSeekSound}
      />
      <AudioControllers
        isPlaying={isPlaying}
        repeat={repeat}
        playSound={playSound}
        pauseSound={pauseSound}
        stopSound={stopSound}
        repeatSound={repeatSound}
      />
    </View>
  );
});

export default AudioPlayerView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
