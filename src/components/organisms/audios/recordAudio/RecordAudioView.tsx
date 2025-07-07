//* packages import
import React, {Fragment} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {isEmpty} from 'lodash';

//* components import
import AudioRecording from '@molecules/audios/recordAudio/audioRecording';
import AudioPlayback from '@molecules/audios/recordAudio/audioPlayback';
import AudioControllers from '@molecules/audios/recordAudio/audioSubmit';

//* hooks import
import {useAudioRecorder} from '@hooks/useAudioRecorder';

//* constants import
import {appColors} from '@constants/colors';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface RecordAudioViewProps {
  navigation: AppStackNavigationProp<'RecordAudio'>;
}

const RecordAudioView = (props: RecordAudioViewProps): React.JSX.Element => {
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
        <AudioRecording
          startRecord={startRecord}
          pauseRecord={pauseRecord}
          resumeRecord={resumeRecord}
          stopRecord={stopRecord}
          recordSecs={recordSecs}
          recordTime={recordTime}
        />
      )}
      {!isEmpty(recordPath) && (
        <Fragment>
          <AudioPlayback
            startPlay={startPlay}
            pausePlay={pausePlay}
            resumePlay={resumePlay}
            stopPlay={stopPlay}
            currentPositionSec={currentPositionSec}
            currentDurationSec={currentDurationSec}
            duration={duration}
            playTime={playTime}
            status={status}
          />
          <AudioControllers
            retakeAudio={retakeAudio}
            uploadAudio={uploadAudio}
            status={status}
          />
        </Fragment>
      )}
    </ScrollView>
  );
};

export default RecordAudioView;

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
