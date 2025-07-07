//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import TextView from '@atoms/TextView';
import TouchableText from '@atoms/TouchableText';

//* constants import
import {appColors} from '@constants/colors';

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

const AudioPlayback = (props: AudioPlaybackProps) => {
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

const styles = StyleSheet.create({
  recordAudioContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerTextStyle: {
    color: appColors.black,
    fontSize: 25,
    fontWeight: 'bold',
  },
  buttonContainerStyle: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
  },
});
