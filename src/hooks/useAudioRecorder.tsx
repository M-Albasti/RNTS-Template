//* packages import
import {useState, useCallback, useLayoutEffect, useMemo, useRef} from 'react';
import {Alert} from 'react-native';
import {
  createSound,
  AVEncoderAudioQualityIOSType,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  RecordBackType,
  PlayBackType,
} from 'react-native-nitro-sound';
import {last} from 'lodash';

//* utils import
import {uniqueFileName} from '@utils/uniqueFileName';

//* redux import
import {uploadAudio} from '@redux/slices/audiosSlice';

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
  const [currentPositionSec, setCurrentPositionSec] = useState<number>(0);
  const [currentDurationSec, setCurrentDurationSec] = useState<number>(0);
  const [playTime, setPlayTime] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [recordPath, setRecordPath] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const audioRecorderPlayerRef = useRef<ReturnType<typeof createSound> | null>(
    null,
  );
  const dispatch = useAppDispatch();
  const {status} = useAppSelector(state => state.audio);

  if (!audioRecorderPlayerRef.current) {
    audioRecorderPlayerRef.current = createSound();
  }

  const audioRecorderPlayer = audioRecorderPlayerRef.current;

  const cleanupAudioResources = useCallback(async () => {
    try {
      const player = audioRecorderPlayerRef.current;
      if (!player) {
        return;
      }
      await player.stopRecorder();
      await player.stopPlayer();
      player.removeRecordBackListener();
      player.removePlayBackListener();
    } catch {
      // Ignore cleanup errors when nothing is active.
    }
  }, []);

  useLayoutEffect(() => {
    permissionsRequest('microphone');
    return () => {
      cleanupAudioResources();
    };
  }, [cleanupAudioResources]);

  const audioSet = useMemo(
    (): AudioSet => ({
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVModeIOS: 'measurement',
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: 'aac',
    }),
    [],
  );

  const handleError = useCallback((error: unknown, operation: string) => {
    console.log(`${operation} Error =>`, error);
    Alert.alert('Audio Error', `Failed to ${operation}. Please try again.`, [
      {text: 'OK'},
    ]);
  }, []);

  const startRecord = useCallback(async () => {
    if (!audioRecorderPlayer) {
      return;
    }

    try {
      setIsLoading(true);
      const path = uniqueFileName('audio', 'm4a');

      const result = await audioRecorderPlayer.startRecorder(
        path,
        audioSet,
        false,
      );

      audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        setRecordSecs(e.currentPosition);
        setRecordTime(
          audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)) || '00:00',
        );
      });

      setAudioState(AudioState.RECORDING);
      console.log('Recording started:', result);
    } catch (error) {
      handleError(error, 'start recording');
    } finally {
      setIsLoading(false);
    }
  }, [audioRecorderPlayer, audioSet, handleError]);

  const pauseRecord = useCallback(async () => {
    if (!audioRecorderPlayer) {
      return;
    }

    try {
      setIsLoading(true);
      await audioRecorderPlayer.pauseRecorder();
      setAudioState(AudioState.PAUSED);
    } catch (error) {
      handleError(error, 'pause recording');
    } finally {
      setIsLoading(false);
    }
  }, [audioRecorderPlayer, handleError]);

  const resumeRecord = useCallback(async () => {
    if (!audioRecorderPlayer) {
      return;
    }

    try {
      setIsLoading(true);
      await audioRecorderPlayer.resumeRecorder();
      setAudioState(AudioState.RECORDING);
    } catch (error) {
      handleError(error, 'resume recording');
    } finally {
      setIsLoading(false);
    }
  }, [audioRecorderPlayer, handleError]);

  const stopRecord = useCallback(async () => {
    if (!audioRecorderPlayer) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordSecs(0);
      setRecordPath(result);
      setAudioState(AudioState.IDLE);
    } catch (error) {
      handleError(error, 'stop recording');
    } finally {
      setIsLoading(false);
    }
  }, [audioRecorderPlayer, handleError]);

  const startPlay = useCallback(async () => {
    if (!audioRecorderPlayer || !recordPath) {
      return;
    }

    try {
      setIsLoading(true);
      await audioRecorderPlayer.startPlayer(recordPath);
      audioRecorderPlayer.setVolume(1.0);
      setAudioState(AudioState.PLAYING);

      audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
        if (e.currentPosition >= e.duration && e.duration > 0) {
          audioRecorderPlayer.stopPlayer();
          audioRecorderPlayer.removePlayBackListener();
          setAudioState(AudioState.IDLE);
        }
        setCurrentPositionSec(e.currentPosition);
        setCurrentDurationSec(e.duration);
        setPlayTime(
          audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)) || '00:00',
        );
        setDuration(
          audioRecorderPlayer.mmssss(Math.floor(e.duration)) || '00:00',
        );
      });
    } catch (error) {
      handleError(error, 'start playback');
    } finally {
      setIsLoading(false);
    }
  }, [audioRecorderPlayer, recordPath, handleError]);

  const pausePlay = useCallback(async () => {
    if (!audioRecorderPlayer) {
      return;
    }

    try {
      setIsLoading(true);
      await audioRecorderPlayer.pausePlayer();
      setAudioState(AudioState.PLAYING_PAUSED);
    } catch (error) {
      handleError(error, 'pause playback');
    } finally {
      setIsLoading(false);
    }
  }, [audioRecorderPlayer, handleError]);

  const resumePlay = useCallback(async () => {
    if (!audioRecorderPlayer) {
      return;
    }

    try {
      setIsLoading(true);
      await audioRecorderPlayer.resumePlayer();
      setAudioState(AudioState.PLAYING);
    } catch (error) {
      handleError(error, 'resume playback');
    } finally {
      setIsLoading(false);
    }
  }, [audioRecorderPlayer, handleError]);

  const stopPlay = useCallback(async () => {
    if (!audioRecorderPlayer) {
      return;
    }

    try {
      setIsLoading(true);
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setCurrentPositionSec(0);
      setAudioState(AudioState.IDLE);
    } catch (error) {
      handleError(error, 'stop playback');
    } finally {
      setIsLoading(false);
    }
  }, [audioRecorderPlayer, handleError]);

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

  const uploadRecordedAudio = useCallback(async () => {
    if (!recordPath) {
      return;
    }

    const extension = last(recordPath.split('.')) || 'm4a';
    const type = `audio/${extension}`;
    const audioFile = {
      uri: recordPath,
      type,
      name: uniqueFileName('audio', extension),
    };
    const formData = new FormData();
    formData.append('file', audioFile as unknown as Blob);
    dispatch(uploadAudio(formData));
  }, [dispatch, recordPath]);

  return {
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
    uploadAudio: uploadRecordedAudio,
  };
};
