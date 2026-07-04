import React from 'react';
import {View} from 'react-native';

import TextView from '@atoms/TextView';
import TouchableText from '@atoms/TouchableText';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveAudioRecordingStyles} from './styles/resolveAudioRecordingStyles';

interface AudioRecordingProps {
  startRecord: () => Promise<void>;
  pauseRecord: () => Promise<void>;
  resumeRecord: () => Promise<void>;
  stopRecord: () => Promise<void>;
  recordSecs?: number | string;
  recordTime?: string;
}

const AudioRecording = (props: AudioRecordingProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveAudioRecordingStyles);

  return (
    <View style={styles.recordAudioContainer}>
      <TextView text={'Record Audio'} style={styles.headerTextStyle} />
      <TouchableText
        textStyle={{}}
        touchableStyle={styles.buttonContainerStyle}
        text={'start record'}
        onPress={props.startRecord}
      />
      <TouchableText
        textStyle={{}}
        touchableStyle={styles.buttonContainerStyle}
        text={'pause record'}
        onPress={props.pauseRecord}
      />
      <TouchableText
        textStyle={{}}
        touchableStyle={styles.buttonContainerStyle}
        text={'resume record'}
        onPress={props.resumeRecord}
      />
      <TouchableText
        textStyle={{}}
        touchableStyle={styles.buttonContainerStyle}
        text={'stop record'}
        onPress={props.stopRecord}
      />
      <TextView text={`recordSecs: ${props.recordSecs}`} />
      <TextView text={`recordTime: ${props.recordTime}`} />
    </View>
  );
};

export default AudioRecording;
