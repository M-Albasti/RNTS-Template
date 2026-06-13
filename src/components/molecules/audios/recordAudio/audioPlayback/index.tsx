import React from 'react';
import {View} from 'react-native';

import TextView from '@atoms/TextView';
import TouchableText from '@atoms/TouchableText';
import {useThemedStyles} from '@theme/createThemedStyles';

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
  const styles = useThemedStyles(t => ({
    recordAudioContainer: {
      ...t.layout.presets.columnCenter,
      paddingTop: t.spacing.xl,
    },
    headerTextStyle: {
      ...t.typography.title,
      color: t.colors.textPrimary,
    },
    buttonContainerStyle: {
      padding: t.spacing.md,
      margin: t.spacing.md,
      borderWidth: t.layout.borderWidth.sm,
      borderRadius: t.radius.lg,
      borderColor: t.colors.border,
      ...t.layout.presets.center,
      width: t.sizes.videoPreview,
    },
  }));

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
