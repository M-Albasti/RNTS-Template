//* packages import
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';
import SoundPlayer from 'react-native-sound-player';

//* types import
import {SoundProps} from '@Types/soundProps';

export const useAudioView = (audioDetails: SoundProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const interval = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    loadSound();
    return () => {
      stopSound();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      interval.current = setInterval(changeCurrentTime, 1000);
    } else if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
    return () => {
      if (interval.current) {
        clearInterval(interval.current); // Cleanup on unmount
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (isLoaded) {
      const _onFinishedPlayingSubscription = SoundPlayer.addEventListener(
        'FinishedPlaying',
        ({success}) => {
          stopSound().then(() => {
            if (Platform.OS === 'android') {
              loadSound();
            }
            if (repeat) {
              playSound();
            }
          });
          console.log('finished playing', success, repeat);
        },
      );
      const _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener(
        'FinishedLoadingURL',
        async ({success, url}) => {
          console.log('finished loading url', success, url);
        },
      );
      return () => {
        _onFinishedPlayingSubscription.remove();
        _onFinishedLoadingURLSubscription.remove();
      };
    }
  }, [repeat, isLoaded]);

  {
    /* Sound Player */
  }
  const loadSound = useCallback(async () => {
    try {
      setIsLoaded(true);
      setIsPlaying(false);
      SoundPlayer.loadUrl(audioDetails?.url);
      const info = await SoundPlayer.getInfo();
      setCurrentTime(info.currentTime);
      setDuration(info.duration);
    } catch (error) {
      setIsLoaded(false);
      console.log('loadSound Error =>', error);
    }
  }, [audioDetails?.url]);

  const changeCurrentTime = useCallback(async () => {
    try {
      setCurrentTime((await SoundPlayer.getInfo()).currentTime);
    } catch (error) {
      console.log('getInfo Error =>', error);
    }
  }, []);

  const playSound = useCallback(() => {
    try {
      // SoundPlayer.setNumberOfLoops(-1);
      if (isLoaded) {
        SoundPlayer.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('playSound Error =>', error);
    }
  }, [isLoaded]);

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

  const stopSound = useCallback(async () => {
    try {
      SoundPlayer.stop();
      setCurrentTime(0);
      setIsPlaying(false);
    } catch (error) {
      console.log('stopSound Error =>', error);
    }
  }, []);

  const repeatSound = useCallback(() => {
    setRepeat(prev => !prev);
  }, []);

  const onSeekSound = useCallback((value: number) => {
    SoundPlayer.seek(value);
    setCurrentTime(value);
  }, []);

  return {
    isPlaying,
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
