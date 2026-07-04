import React from 'react';
import {View} from 'react-native';

import TextView from '@atoms/TextView';
import TouchableText from '@atoms/TouchableText';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveAudioPlaybackStyles} from './styles/resolveAudioPlaybackStyles';

interface AudioPlaybackProps {
  startPlay: () => Promise<void>;
  pausePlay: () => Promise<void>;
  resumePlay: () => Promise<void>;
  stopPlay: () => Promise<void>;
  currentPositionSec?: number;
  currentDurationSec?: number;
  duration?: string;
  playTime?: string;
  status: string;
}

const AudioPlayback = (props: AudioPlaybackProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveAudioPlaybackStyles);

  return (
    <View style={styles.recordAudioContainer}>
      <TextView text={'Recorded Audio'} style={styles.headerTextStyle} />
      <TouchableText
        textStyle={{}}
        touchableStyle={styles.buttonContainerStyle}
        text={'start play'}
        onPress={props.startPlay}
      />
      <TouchableText
        textStyle={{}}
        touchableStyle={styles.buttonContainerStyle}
        text={'pause play'}
        onPress={props.pausePlay}
      />
      <TouchableText
        textStyle={{}}
        touchableStyle={styles.buttonContainerStyle}
        text={'resume play'}
        onPress={props.resumePlay}
      />
      <TouchableText
        textStyle={{}}
        touchableStyle={styles.buttonContainerStyle}
        text={'stop play'}
        onPress={props.stopPlay}
      />
      <TextView text={`currentPositionSec: ${props.currentPositionSec}`} />
      <TextView text={`currentDurationSec: ${props.currentDurationSec}`} />
      <TextView text={`duration: ${props.duration}`} />
      <TextView text={`playTime: ${props.playTime}`} />
    </View>
  );
};

export default AudioPlayback;
