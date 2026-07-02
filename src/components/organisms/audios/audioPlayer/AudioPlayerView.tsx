//* packages import
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import Heading from '@atoms/Heading';
import AudioContent from '@molecules/audios/audioPlayer/audioContent';
import AudioControllers from '@molecules/audios/audioPlayer/audioControllers';
import AudioProgressBar from '@molecules/audios/audioPlayer/audioProgressBar';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveAudioPlayerViewStyles} from './styles/resolveAudioPlayerViewStyles';

//* types import
import {SoundProps} from '@Types/soundProps';

interface AudioPlayerViewProps {
  audioDetails: SoundProps;
  loadError: string | null;
  isPlaying: boolean;
  repeat: boolean;
  currentTime: number;
  duration: number;
  playSound: () => void;
  pauseSound: () => void;
  stopSound: () => void;
  repeatSound: () => void;
  onSeekSound: (value: number) => void;
}

const AudioPlayerView = memo(
  ({
    audioDetails,
    loadError,
    isPlaying,
    repeat,
    currentTime,
    duration,
    playSound,
    pauseSound,
    stopSound,
    repeatSound,
    onSeekSound,
  }: AudioPlayerViewProps) => {
    const styles = useThemedStyles(resolveAudioPlayerViewStyles);

    return (
      <View style={styles.container}>
        {loadError ? (
          <View style={styles.errorBanner}>
            <Heading text={loadError} level="h3" />
          </View>
        ) : null}
        <AudioContent audioDetails={audioDetails} />
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
  },
);

export default AudioPlayerView;
