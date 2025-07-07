//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import TextView from '@atoms/TextView';
import TouchableText from '@atoms/TouchableText';

//* constants import
import {appColors} from '@constants/colors';

interface AudioRecordingProps {
  startRecord: () => Promise<void>;
  pauseRecord: () => Promise<void>;
  resumeRecord: () => Promise<void>;
  stopRecord: () => Promise<void>;
  recordSecs?: number | string;
  recordTime?: string;
}

const AudioRecording = (props: AudioRecordingProps) => {
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
