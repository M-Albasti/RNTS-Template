//* packages import
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Alert, Platform} from 'react-native';
import SoundPlayer from 'react-native-sound-player';

//* types import
import {SoundProps} from '@Types/soundProps';

export const useAudioView = (audioDetails: SoundProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioUrl = audioDetails?.url;

  const stopSound = useCallback(async () => {
    try {
      SoundPlayer.stop();
      setCurrentTime(0);
      setIsPlaying(false);
    } catch (error) {
      console.log('stopSound Error =>', error);
    }
  }, []);

  const playSound = useCallback(() => {
    if (loadError) {
      Alert.alert('Playback error', loadError);
      return;
    }
    try {
      if (isLoaded) {
        SoundPlayer.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('playSound Error =>', error);
      Alert.alert('Playback error', 'Unable to play this track.');
    }
  }, [isLoaded, loadError]);

  const loadSound = useCallback(async () => {
    if (!audioUrl) {
      setIsLoaded(false);
      setLoadError('No audio URL provided.');
      return;
    }

    try {
      setIsLoaded(false);
      setLoadError(null);
      setIsPlaying(false);
      SoundPlayer.loadUrl(audioUrl);
      const info = await SoundPlayer.getInfo();
      setCurrentTime(info.currentTime);
      setDuration(info.duration);
      setIsLoaded(true);
    } catch (error) {
      setIsLoaded(false);
      setLoadError('Unable to load this track.');
      console.log('loadSound Error =>', error);
    }
  }, [audioUrl]);

  useLayoutEffect(() => {
    loadSound();
    return () => {
      stopSound();
    };
  }, [loadSound, stopSound]);

  useEffect(() => {
    if (isPlaying) {
      interval.current = setInterval(async () => {
        try {
          const info = await SoundPlayer.getInfo();
          setCurrentTime(info.currentTime);
        } catch {
          // Ignore polling errors while paused or stopped.
        }
      }, 500);
    } else if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const finishedPlaying = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({success}) => {
        if (!success) {
          return;
        }
        stopSound().then(() => {
          if (Platform.OS === 'android') {
            loadSound();
          }
          if (repeat) {
            playSound();
          }
        });
      },
    );

    const finishedLoading = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      async ({success, url}) => {
        if (!success) {
          setIsLoaded(false);
          setLoadError('Unable to load this track.');
          return;
        }
        if (url === audioUrl) {
          try {
            const info = await SoundPlayer.getInfo();
            setDuration(info.duration);
            setCurrentTime(info.currentTime);
            setIsLoaded(true);
            setLoadError(null);
          } catch {
            setLoadError('Unable to read track info.');
          }
        }
      },
    );

    return () => {
      finishedPlaying.remove();
      finishedLoading.remove();
    };
  }, [audioUrl, isLoaded, loadSound, playSound, repeat, stopSound]);

  const pauseSound = useCallback(() => {
    try {
      if (isPlaying) {
        SoundPlayer.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.log('pauseSound Error =>', error);
    }
  }, [isPlaying]);

  const repeatSound = useCallback(() => {
    setRepeat(prev => !prev);
  }, []);

  const onSeekSound = useCallback((value: number) => {
    SoundPlayer.seek(value);
    setCurrentTime(value);
  }, []);

  return {
    isPlaying,
    isLoaded,
    loadError,
    repeat,
    currentTime,
    duration,
    playSound,
    pauseSound,
    stopSound,
    repeatSound,
    onSeekSound,
  };
};
