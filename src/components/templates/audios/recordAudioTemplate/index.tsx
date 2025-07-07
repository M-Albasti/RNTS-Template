//* packages import
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {isEmpty} from 'lodash';

//* components import
import TextView from '@atoms/TextView';
import TouchableText from '@atoms/TouchableText';

//* hooks import
import {useAudioRecorder} from '@hooks/useAudioRecorder';

//* constants import
import {appColors} from '@constants/colors';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface RecordAudioTemplateProps {
  navigation: AppStackNavigationProp<'RecordAudio'>;
}

const RecordAudioTemplate = (props: RecordAudioTemplateProps): React.JSX.Element => {
  const {
    audioState,
    recordSecs,
    recordTime,
    currentPositionSec,
    currentDurationSec,
    playTime,
    duration,
    recordPath,
    isLoading,
    status,
    startRecord,
    pauseRecord,
    resumeRecord,
    stopRecord,
    startPlay,
    pausePlay,
    resumePlay,
    stopPlay,
    retakeAudio,
    uploadAudio,
  } = useAudioRecorder();

  return (
    <ScrollView style={styles.container}>
      {isEmpty(recordPath) && (
        <View style={styles.recordAudioContainer}>
          <TextView text={'Record Audio'} style={styles.headerTextStyle} />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'start record'}
            onPress={startRecord}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'pause record'}
            onPress={pauseRecord}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'resume record'}
            onPress={resumeRecord}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'stop record'}
            onPress={stopRecord}
          />
          <TextView text={`recordSecs: ${recordSecs}`} />
          <TextView text={`recordTime: ${recordTime}`} />
        </View>
      )}
      {!isEmpty(recordPath) && (
        <View style={styles.recordAudioContainer}>
          <TextView text={'Recorded Audio'} style={styles.headerTextStyle} />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'start play'}
            onPress={startPlay}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'pause play'}
            onPress={pausePlay}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'resume play'}
            onPress={resumePlay}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'stop play'}
            onPress={stopPlay}
          />
          <TextView text={`currentPositionSec: ${currentPositionSec}`} />
          <TextView text={`currentDurationSec: ${currentDurationSec}`} />
          <TextView text={`duration: ${duration}`} />
          <TextView text={`playTime: ${playTime}`} />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'Retake Audio'}
            onPress={retakeAudio}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={status == 'loading' ? 'Upload in progress' : 'Upload Audio'}
            onPress={uploadAudio}
            disabled={status == 'loading'}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default RecordAudioTemplate;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
