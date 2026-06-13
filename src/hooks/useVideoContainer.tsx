//* packages import
import {useCallback, useRef, useState} from 'react';
import {Alert} from 'react-native';

//* types import
import {OnVideoErrorData, VideoRef} from 'react-native-video';

export const useVideoContainer = () => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<VideoRef | null>(null);

  const onVideoReady = useCallback((ref: VideoRef) => {
    videoRef.current = ref;
  }, []);

  const onError = useCallback((error: OnVideoErrorData) => {
    const message =
      error.error?.errorString ||
      error.error?.localizedDescription ||
      'Unable to play this video.';
    setErrorMessage(message);
    console.log('Video Error =>', error);
    Alert.alert('Video error', message);
  }, []);

  const videoPause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const videoResume = useCallback(() => {
    videoRef.current?.resume();
  }, []);

  const videoDismissFullScreen = useCallback(() => {
    if (videoRef.current) {
      setFullscreen(false);
      videoRef.current.dismissFullscreenPlayer();
    }
  }, []);

  const videoPresentFullScreen = useCallback(() => {
    if (videoRef.current) {
      setFullscreen(true);
      videoRef.current.presentFullscreenPlayer();
    }
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => !prev);
  }, []);

  return {
    fullscreen,
    repeat,
    errorMessage,
    videoRef,
    onVideoReady,
    onError,
    videoPause,
    videoResume,
    videoDismissFullScreen,
    videoPresentFullScreen,
    toggleRepeat,
  };
};
