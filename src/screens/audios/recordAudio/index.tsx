import React, {useEffect, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
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

const RecordAudio = (props: any): React.JSX.Element => {
  const [recordSecs, setRecordSecs] = useState<string | number>();
  const [recordTime, setRecordTime] = useState<string>();
  const [currentPositionSec, setCurrentPositionSec] = useState<number>();
  const [currentDurationSec, setCurrentDurationSec] = useState<number>();
  const [playTime, setPlayTime] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [recordPath, setRecordPath] = useState<string>();
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  console.log(
    '🚀 ~ Audio ~ audioRecorderPlayer:',
    recordSecs,
    recordTime,
    currentPositionSec,
    currentDurationSec,
    playTime,
    duration,
  );

  useEffect(() => {
    permissionsRequest('microphone');
  }, []);

  {
    /* Sound Recorder */
  }
  const onStartRecord = async () => {
    try {
      const path = `audio-${new Date()}.m4a`;
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
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttonContainerStyle}
        onPress={onStartRecord}>
        <Text>start record</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainerStyle}
        onPress={onPauseRecord}>
        <Text>pause record</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainerStyle}
        onPress={onResumeRecord}>
        <Text>resume record</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainerStyle}
        onPress={onStopRecord}>
        <Text>stop record</Text>
      </TouchableOpacity>
      <View style={{borderWidth: 1, width: '100%', borderColor: '#000'}} />
      <TouchableOpacity
        style={styles.buttonContainerStyle}
        onPress={onStartPlay}>
        <Text>start play</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainerStyle}
        onPress={onPausePlay}>
        <Text>pause play</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainerStyle}
        onPress={onResumePlay}>
        <Text>resume play</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainerStyle}
        onPress={onStopPlay}>
        <Text>stop play</Text>
      </TouchableOpacity>
      <Text>recordSecs: {recordSecs}</Text>
      <Text>recordTime: {recordTime}</Text>
      <Text>currentPositionSec: {currentPositionSec}</Text>
      <Text>currentDurationSec: {currentDurationSec}</Text>
      <Text>duration: {duration}</Text>
      <Text>playTime: {playTime}</Text>

      <Text>{recordPath}</Text>
    </View>
  );
};

export default RecordAudio;
