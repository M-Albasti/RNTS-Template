//* packages import
import {useCallback, useRef, useState} from 'react';

//* types import
import {OnVideoErrorData, VideoRef} from 'react-native-video';

export const useVideoContainer = () => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(false);
  const videoRef = useRef<VideoRef | null>(null);

  const onVideoReady = useCallback((ref: VideoRef) => {
    videoRef.current = ref;
  }, []);

  const onError = useCallback((error: OnVideoErrorData) => {
    console.log('Video Error =>', error);
  }, []);

  const videoPause = () => {
    if (videoRef?.current) {
      videoRef?.current?.pause();
    }
  };

  const videoResume = () => {
    if (videoRef?.current) {
      videoRef?.current?.resume();
    }
  };

  const videoDismissFullScreen = () => {
    if (videoRef?.current) {
      setFullscreen(false);
      videoRef?.current?.dismissFullscreenPlayer();
    }
  };

  const videoPresentFullScreen = () => {
    if (videoRef?.current) {
      setFullscreen(true);
      videoRef?.current?.presentFullscreenPlayer();
    }
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  return {
    // State
    fullscreen,
    repeat,
    videoRef,

    // Actions
    onVideoReady,
    onError,
    videoPause,
    videoResume,
    videoDismissFullScreen,
    videoPresentFullScreen,
    toggleRepeat,
  };
};
