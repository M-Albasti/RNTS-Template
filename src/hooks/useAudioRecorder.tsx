//* packages import
import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react';
import {Alert} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import {last} from 'lodash';
import moment from 'moment';

//* redux import
import {addAudio, uploadAudio} from '@redux/slices/audiosSlice';

//* helpers import
import {permissionsRequest} from '@helpers/permissionsRequest';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

// Audio state enum for better state management
export enum AudioState {
  IDLE = 'idle',
  RECORDING = 'recording',
  PAUSED = 'paused',
  PLAYING = 'playing',
  PLAYING_PAUSED = 'playing_paused',
}

export interface AudioRecorderActions {
  startRecord: () => Promise<void>;
  pauseRecord: () => Promise<void>;
  resumeRecord: () => Promise<void>;
  stopRecord: () => Promise<void>;
  startPlay: () => Promise<void>;
  pausePlay: () => Promise<void>;
  resumePlay: () => Promise<void>;
  stopPlay: () => Promise<void>;
  retakeAudio: () => void;
  uploadAudio: () => void;
}

export const useAudioRecorder = () => {
  const [audioState, setAudioState] = useState<AudioState>(AudioState.IDLE);
  const [recordSecs, setRecordSecs] = useState<string | number>();
  const [recordTime, setRecordTime] = useState<string>();
  const [currentPositionSec, setCurrentPositionSec] = useState<number>();
  const [currentDurationSec, setCurrentDurationSec] = useState<number>();
  const [playTime, setPlayTime] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [recordPath, setRecordPath] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const {status} = useAppSelector(state => state.audio);

  useLayoutEffect(() => {
    permissionsRequest('microphone');
    // Cleanup function
    return () => {
      cleanupAudioResources();
    };
  }, []);

  // Cleanup function for audio resources
  const cleanupAudioResources = useCallback(async () => {
    try {
      if (audioRecorderPlayer) {
        await audioRecorderPlayer.stopRecorder();
        await audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removeRecordBackListener();
        audioRecorderPlayer.removePlayBackListener();
      }
    } catch (error) {
      console.log('Cleanup error:', error);
    }
  }, []);

  // Memoized audio configuration
  const audioSet = useMemo(
    (): AudioSet => ({
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVModeIOS: AVModeIOSOption.measurement,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    }),
    [],
  );

  // Error handler
  const handleError = useCallback((error: unknown, operation: string) => {
    console.log(`${operation} Error =>`, error);
    Alert.alert('Audio Error', `Failed to ${operation}. Please try again.`, [
      {text: 'OK'},
    ]);
  }, []);

  // Audio recording functions
  const startRecord = useCallback(async () => {
    if (!audioRecorderPlayer) return;

    try {
      setIsLoading(true);
      const path = `audio-${moment().unix()}.m4a`;
      const meteringEnabled = false;

      const result = await audioRecorderPlayer.startRecorder(
        // path,
        undefined,
        audioSet,
        meteringEnabled,
      );

      audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        setRecordSecs(e.currentPosition);
        setRecordTime(
          audioRecorderPlayer?.mmssss(Math.floor(e.currentPosition)) || '00:00',
        );
      });

      setAudioState(AudioState.RECORDING);
      console.log('Recording started:', result);
    } catch (error) {
      handleError(error, 'start recording');
    } finally {
      setIsLoading(false);
    }
  }, [audioSet, handleError]);

  const pauseRecord = useCallback(async () => {
    if (!audioRecorderPlayer) return;

    try {
      setIsLoading(true);
      const result = await audioRecorderPlayer.pauseRecorder();
      setAudioState(AudioState.PAUSED);
      console.log('Recording paused:', result);
    } catch (error) {
      handleError(error, 'pause recording');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const resumeRecord = useCallback(async () => {
    if (!audioRecorderPlayer) return;

    try {
      setIsLoading(true);
      const result = await audioRecorderPlayer.resumeRecorder();
      setAudioState(AudioState.RECORDING);
      console.log('Recording resumed:', result);
    } catch (error) {
      handleError(error, 'resume recording');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const stopRecord = useCallback(async () => {
    if (!audioRecorderPlayer) return;

    try {
      setIsLoading(true);
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordSecs(0);
      setRecordPath(result);
      setAudioState(AudioState.IDLE);
      console.log('Recording stopped:', result);
    } catch (error) {
      handleError(error, 'stop recording');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Audio playback functions
  const startPlay = useCallback(async () => {
    if (!audioRecorderPlayer || !recordPath) return;

    try {
      console.log('onStartPlay');
      setIsLoading(true);
      const msg = await audioRecorderPlayer.startPlayer();
      audioRecorderPlayer.setVolume(1.0);
      console.log(msg);
      setAudioState(AudioState.PLAYING);

      audioRecorderPlayer.addPlayBackListener(async e => {
        if (e.currentPosition === e.duration) {
          console.log('Playback finished');
          await audioRecorderPlayer.stopPlayer();
          setAudioState(AudioState.IDLE);
        }
        setCurrentPositionSec(e.duration);
        setCurrentDurationSec(e.currentPosition);
        setPlayTime(
          audioRecorderPlayer?.mmssss(Math.floor(e.currentPosition)) || '00:00',
        );
        setDuration(
          audioRecorderPlayer?.mmssss(Math.floor(e.duration)) || '00:00',
        );
      });
    } catch (error) {
      handleError(error, 'start playback');
    } finally {
      setIsLoading(false);
    }
  }, [recordPath, handleError]);

  const pausePlay = useCallback(async () => {
    if (!audioRecorderPlayer) return;

    try {
      setIsLoading(true);
      await audioRecorderPlayer.pausePlayer();
      setAudioState(AudioState.PLAYING_PAUSED);
    } catch (error) {
      handleError(error, 'pause playback');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const resumePlay = useCallback(async () => {
    if (!audioRecorderPlayer) return;

    try {
      setIsLoading(true);
      await audioRecorderPlayer.resumePlayer();
      setAudioState(AudioState.PLAYING);
    } catch (error) {
      handleError(error, 'resume playback');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const stopPlay = useCallback(async () => {
    if (!audioRecorderPlayer) return;

    try {
      setIsLoading(true);
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setAudioState(AudioState.IDLE);
    } catch (error) {
      handleError(error, 'stop playback');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const retakeAudio = useCallback(() => {
    setRecordPath('');
    setRecordSecs('');
    setRecordTime('');
    setPlayTime('');
    setDuration('');
    setCurrentDurationSec(0);
    setCurrentPositionSec(0);
    setAudioState(AudioState.IDLE);
  }, []);

  const uploadAudio = useCallback(async () => {
    if (!recordPath) return;

    const extension = last(recordPath?.split('.')) || '';
    const type = `audio/${extension}`;
    const audioFile = {
      uri: recordPath,
      type: type,
      name: `audio-${moment().unix()}.${extension}`,
    };
    const formData = new FormData();
    formData.append('file', audioFile);
    console.log('Uploading audio:', recordPath);
    // dispatch(uploadAudio(formData)).then(() => {
    //   dispatch(addAudio(audioFile));
    // });
  }, [recordPath]);

  return {
    // State
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

    // Actions
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
  };
};
