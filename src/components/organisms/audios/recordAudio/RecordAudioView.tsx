import {layout} from '@theme/tokens';

import React, {Fragment} from 'react';
import {ScrollView} from 'react-native';

import AudioRecording from '@molecules/audios/recordAudio/audioRecording';
import AudioPlayback from '@molecules/audios/recordAudio/audioPlayback';
import AudioControllers from '@molecules/audios/recordAudio/audioSubmit';
import {useAudioRecorder} from '@hooks/useAudioRecorder';
import {useThemedStyles} from '@theme/createThemedStyles';

import type {AppStackNavigationProp} from '@Types/appNavigation';

interface RecordAudioViewProps {
  navigation: AppStackNavigationProp<'RecordAudio'>;
}

const RecordAudioView = (_props: RecordAudioViewProps): React.JSX.Element => {
  const styles = useThemedStyles(t => ({
    container: {
      flex: layout.flex.fill,
      backgroundColor: t.colors.background,
    },
  }));

  const {
    recordSecs,
    recordTime,
    currentPositionSec,
    currentDurationSec,
    playTime,
    duration,
    recordPath,
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

  const hasRecording = Boolean(recordPath);

  return (
    <ScrollView style={styles.container}>
      {!hasRecording ? (
        <AudioRecording
          startRecord={startRecord}
          pauseRecord={pauseRecord}
          resumeRecord={resumeRecord}
          stopRecord={stopRecord}
          recordSecs={recordSecs}
          recordTime={recordTime}
        />
      ) : (
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
