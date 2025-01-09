import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {styles} from './styles';
import {permissionsRequest} from '@services/permissionsRequest';
import _ from 'lodash';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {addAudio, uploadAudio} from '@redux/slices/audiosSlice';
import {useAppSelector} from '@hooks/useAppSelector';
import moment from 'moment';
import TextView from '@atoms/TextView';
import TouchableText from '@atoms/TouchableText';
import { AppStackNavigationProp } from '@Types/appNavigation';

interface RecordAudioProps {
  navigation: AppStackNavigationProp<'RecordAudio'>
}

const RecordAudio = (props: RecordAudioProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [recordSecs, setRecordSecs] = useState<string | number>();
  const [recordTime, setRecordTime] = useState<string>();
  const [currentPositionSec, setCurrentPositionSec] = useState<number>();
  const [currentDurationSec, setCurrentDurationSec] = useState<number>();
  const [playTime, setPlayTime] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [recordPath, setRecordPath] = useState<string>();
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const {status} = useAppSelector(state => state.audio);

  useEffect(() => {
    permissionsRequest('microphone');
  }, []);

  {
    /* Sound Recorder */
  }
  const onStartRecord = async () => {
    try {
      const path = `audio-${moment().unix()}.m4a`;
      const audioSet: AudioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVModeIOS: AVModeIOSOption.measurement,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };
      const meteringEnabled = false;

      const result = await audioRecorderPlayer.startRecorder(
        // path,
        undefined,
        audioSet,
        meteringEnabled,
      );

      audioRecorderPlayer.addRecordBackListener((e: any) => {
        setRecordSecs(e.currentPosition);
        setRecordTime(
          audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        );
      });
      console.log('Result =>', result);
    } catch (error) {
      console.log('onStartRecord Error =>', error);
    }
  };

  const onPauseRecord = async () => {
    try {
      const result = await audioRecorderPlayer.pauseRecorder();
      console.log('Result =>', result);
    } catch (error) {
      console.log('onPauseRecord Error =>', error);
    }
  };

  const onResumeRecord = async () => {
    try {
      const result = await audioRecorderPlayer.resumeRecorder();
      console.log('Result =>', result);
    } catch (error) {
      console.log('onResumeRecord Error =>', error);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordSecs(0);
      setRecordPath(result);
      console.log('Result =>', result);
    } catch (error) {
      console.log('onStopRecord Error =>', error);
    }
  };

  const onStartPlay = async () => {
    try {
      console.log('onStartPlay');
      const msg = await audioRecorderPlayer.startPlayer();
      audioRecorderPlayer.setVolume(1.0);
      console.log(msg);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          console.log('finished');
          audioRecorderPlayer.stopPlayer();
        }
        setCurrentPositionSec(e.duration);
        setCurrentDurationSec(e.currentPosition);
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      });
    } catch (error) {
      console.log('onStartPlay Error =>', error);
    }
  };

  const onPausePlay = async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
    } catch (error) {
      console.log('onPausePlay Error =>', error);
    }
  };

  const onResumePlay = async () => {
    try {
      await audioRecorderPlayer.resumePlayer();
    } catch (error) {
      console.log('onResumePlay Error =>', error);
    }
  };

  const onStopPlay = async () => {
    try {
      console.log('onStopPlay');
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    } catch (error) {
      console.log('onStopPlay Error =>', error);
    }
  };

  const retakeAudio = () => {
    setRecordPath('');
    setRecordSecs('');
    setRecordTime('');
    setPlayTime('');
    setDuration('');
    setCurrentDurationSec(0);
    setCurrentPositionSec(0);
  };

  const onUploadAudio = () => {
    const extension = _.last(recordPath?.split('.')) || '';
    const type = `audio/${extension}`;
    const audioFile = {
      uri: recordPath,
      type: type,
      name: `audio-${moment().unix()}.${extension}`,
    };
    const formData = new FormData();
    formData.append('file', audioFile);
    // dispatch(uploadAudio(formData)).then(() => {
    //   dispatch(addAudio(audioFile));
    // });
  };

  return (
    <ScrollView style={styles.container}>
      {_.isEmpty(recordPath) && (
        <View style={styles.recordAudioContainer}>
          <TextView text={'Record Audio'} style={styles.headerTextStyle} />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'start record'}
            onPress={onStartRecord}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'pause record'}
            onPress={onPauseRecord}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'resume record'}
            onPress={onResumeRecord}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'stop record'}
            onPress={onStopRecord}
          />
          <TextView text={`recordSecs: ${recordSecs}`} />
          <TextView text={`recordTime: ${recordTime}`} />
        </View>
      )}
      {!_.isEmpty(recordPath) && (
        <View style={styles.recordAudioContainer}>
          <TextView text={'Recorded Audio'} style={styles.headerTextStyle} />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'start play'}
            onPress={onStartPlay}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'pause play'}
            onPress={onPausePlay}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'resume play'}
            onPress={onResumePlay}
          />
          <TouchableText
            textStyle={{}}
            touchableStyle={styles.buttonContainerStyle}
            text={'stop play'}
            onPress={onStopPlay}
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
            onPress={onUploadAudio}
            disabled={status == 'loading'}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default RecordAudio;
