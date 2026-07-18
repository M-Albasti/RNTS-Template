import {useCallback, useEffect, useRef, useState} from 'react';
import SoundPlayer from 'react-native-sound-player';

import {
  configureBackgroundAudioPlayback,
  toSecureMediaUrl,
} from '@helpers/backgroundAudio';
import type {AdhkarItem} from '@Types/islamicTypes';

type PlaybackMode = 'sequential' | 'continuous';

type UseAdhkarAudioPlayerArgs = {
  items: AdhkarItem[];
  /** Stable playlist identity — resets when session/category/reciter changes. */
  playlistKey: string | number;
  /** Sequential Hisn clips vs one continuous session MP3. */
  mode?: PlaybackMode;
  /** Required when mode is continuous. */
  continuousUrl?: string;
  onItemChange?: (itemId: number, index: number) => void;
};

/**
 * Adhkar audio: Hisn item-by-item (with repeat counts) or a continuous full-session track.
 */
export const useAdhkarAudioPlayer = ({
  items,
  playlistKey,
  mode = 'sequential',
  continuousUrl,
  onItemChange,
}: UseAdhkarAudioPlayerArgs) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedTrack, setHasLoadedTrack] = useState(false);

  const itemsRef = useRef(items);
  const activeIndexRef = useRef(0);
  const repeatLeftRef = useRef(1);
  const pendingUrlRef = useRef<string | null>(null);
  const onItemChangeRef = useRef(onItemChange);
  const playIndexRef = useRef<(index: number) => void>(() => undefined);
  const modeRef = useRef(mode);
  const continuousUrlRef = useRef(continuousUrl);

  itemsRef.current = items;
  onItemChangeRef.current = onItemChange;
  modeRef.current = mode;
  continuousUrlRef.current = continuousUrl;

  const clearPlaybackState = useCallback(() => {
    setIsPlaying(false);
    setHasLoadedTrack(false);
    pendingUrlRef.current = null;
  }, []);

  const playContinuous = useCallback(() => {
    const url = toSecureMediaUrl(continuousUrlRef.current);
    if (!url) {
      return;
    }
    try {
      configureBackgroundAudioPlayback();
      setIsLoading(true);
      setIsPlaying(false);
      setHasLoadedTrack(false);
      pendingUrlRef.current = url;
      SoundPlayer.playUrl(url);
    } catch (error) {
      console.log('useAdhkarAudioPlayer playContinuous Error =>', error);
      setIsLoading(false);
      clearPlaybackState();
    }
  }, [clearPlaybackState]);

  const playIndex = useCallback(
    (index: number) => {
      if (modeRef.current === 'continuous') {
        playContinuous();
        return;
      }

      const list = itemsRef.current;
      if (!list.length) {
        return;
      }
      const safeIndex = Math.max(0, Math.min(list.length - 1, index));
      const item = list[safeIndex];
      const url = toSecureMediaUrl(item.audioUrl);
      if (!url) {
        if (safeIndex < list.length - 1) {
          playIndexRef.current(safeIndex + 1);
        }
        return;
      }

      try {
        configureBackgroundAudioPlayback();
        setIsLoading(true);
        setIsPlaying(false);
        setHasLoadedTrack(false);
        activeIndexRef.current = safeIndex;
        setActiveIndex(safeIndex);
        repeatLeftRef.current = Math.max(1, item.repeat || 1);
        pendingUrlRef.current = url;
        onItemChangeRef.current?.(item.id, safeIndex);
        SoundPlayer.playUrl(url);
      } catch (error) {
        console.log('useAdhkarAudioPlayer playIndex Error =>', error);
        setIsLoading(false);
        clearPlaybackState();
      }
    },
    [clearPlaybackState, playContinuous],
  );

  playIndexRef.current = playIndex;

  const pause = useCallback(() => {
    try {
      SoundPlayer.pause();
      setIsPlaying(false);
    } catch (error) {
      console.log('useAdhkarAudioPlayer pause Error =>', error);
    }
  }, []);

  const resume = useCallback(() => {
    try {
      if (!hasLoadedTrack) {
        playIndex(activeIndexRef.current);
        return;
      }
      configureBackgroundAudioPlayback();
      SoundPlayer.resume();
      setIsPlaying(true);
    } catch (error) {
      try {
        SoundPlayer.play();
        setIsPlaying(true);
      } catch (playError) {
        console.log('useAdhkarAudioPlayer resume Error =>', playError ?? error);
      }
    }
  }, [hasLoadedTrack, playIndex]);

  const stop = useCallback(() => {
    try {
      SoundPlayer.stop();
    } catch (error) {
      console.log('useAdhkarAudioPlayer stop Error =>', error);
    }
    setIsLoading(false);
    clearPlaybackState();
  }, [clearPlaybackState]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
      return;
    }
    if (hasLoadedTrack) {
      resume();
      return;
    }
    playIndex(activeIndexRef.current);
  }, [hasLoadedTrack, isPlaying, pause, playIndex, resume]);

  const playNext = useCallback(() => {
    if (modeRef.current === 'continuous') {
      return;
    }
    const next = Math.min(itemsRef.current.length - 1, activeIndexRef.current + 1);
    if (next !== activeIndexRef.current) {
      playIndex(next);
    }
  }, [playIndex]);

  const playPrevious = useCallback(() => {
    if (modeRef.current === 'continuous') {
      return;
    }
    const previous = Math.max(0, activeIndexRef.current - 1);
    if (previous !== activeIndexRef.current) {
      playIndex(previous);
    }
  }, [playIndex]);

  useEffect(() => {
    const finishedLoading = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      ({success, url}) => {
        if (!pendingUrlRef.current) {
          return;
        }
        if (url && pendingUrlRef.current !== url) {
          return;
        }
        if (!success) {
          setIsLoading(false);
          clearPlaybackState();
          return;
        }
        pendingUrlRef.current = null;
        setHasLoadedTrack(true);
        setIsPlaying(true);
        setIsLoading(false);
      },
    );

    const finishedPlaying = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({success}) => {
        if (!success) {
          return;
        }

        // Continuous session track — stop at end (user can replay).
        if (modeRef.current === 'continuous') {
          clearPlaybackState();
          setIsLoading(false);
          return;
        }

        if (repeatLeftRef.current > 1) {
          repeatLeftRef.current -= 1;
          const item = itemsRef.current[activeIndexRef.current];
          const url = toSecureMediaUrl(item?.audioUrl);
          if (url) {
            try {
              configureBackgroundAudioPlayback();
              setIsLoading(true);
              pendingUrlRef.current = url;
              SoundPlayer.playUrl(url);
            } catch (error) {
              console.log('useAdhkarAudioPlayer repeat Error =>', error);
              clearPlaybackState();
            }
          }
          return;
        }

        const next = activeIndexRef.current + 1;
        if (next < itemsRef.current.length) {
          playIndexRef.current(next);
          return;
        }

        clearPlaybackState();
        setIsLoading(false);
      },
    );

    return () => {
      finishedLoading.remove();
      finishedPlaying.remove();
    };
  }, [clearPlaybackState]);

  useEffect(() => {
    try {
      SoundPlayer.stop();
    } catch {
      // ignore
    }
    setIsLoading(false);
    clearPlaybackState();
    activeIndexRef.current = 0;
    setActiveIndex(0);
    repeatLeftRef.current = Math.max(1, itemsRef.current[0]?.repeat || 1);
  }, [clearPlaybackState, playlistKey]);

  useEffect(
    () => () => {
      try {
        SoundPlayer.stop();
      } catch {
        // ignore cleanup errors
      }
    },
    [],
  );

  const activeItem = items[activeIndex];

  return {
    activeIndex,
    activeItemId: activeItem?.id,
    isPlaying,
    isLoading,
    hasLoadedTrack,
    isContinuous: mode === 'continuous',
    playIndex,
    pause,
    resume,
    stop,
    togglePlay,
    playNext,
    playPrevious,
  };
};
