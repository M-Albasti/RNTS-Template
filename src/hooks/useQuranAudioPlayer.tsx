import {useCallback, useEffect, useRef, useState} from 'react';
import SoundPlayer from 'react-native-sound-player';

import {buildSurahAudioUrl} from '@helpers/quranAudioHelpers';

type UseQuranAudioPlayerArgs = {
  surahNumber: number;
  reciterId: string;
  /** Kept for API compatibility; continuous mode plays the whole surah. */
  initialAyahNumber?: number;
  onAyahChange?: (ayahNumber: number) => void;
  onSurahChange?: (surahNumber: number) => void;
  onSurahFinished?: () => void;
};

/**
 * Continuous full-surah player (mp3quran.net).
 * One MP3 per surah — no verse-by-verse gaps.
 */
export const useQuranAudioPlayer = ({
  surahNumber,
  reciterId,
  initialAyahNumber = 1,
  onAyahChange,
  onSurahChange,
  onSurahFinished,
}: UseQuranAudioPlayerArgs) => {
  const [activeAyahNumber, setActiveAyahNumber] = useState(initialAyahNumber);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedTrack, setHasLoadedTrack] = useState(false);

  const loadedKeyRef = useRef<string | null>(null);
  const pendingKeyRef = useRef<string | null>(null);
  const pendingSurahRef = useRef<number | null>(null);
  /** When we advance surah ourselves, skip the hard reset so audio keeps playing. */
  const skipExternalResetRef = useRef(false);
  const skipResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const surahNumberRef = useRef(surahNumber);
  const reciterIdRef = useRef(reciterId);
  const onAyahChangeRef = useRef(onAyahChange);
  const onSurahChangeRef = useRef(onSurahChange);
  const onSurahFinishedRef = useRef(onSurahFinished);
  const loadAndPlaySurahRef = useRef<(targetSurah: number) => void>(() => undefined);

  surahNumberRef.current = surahNumber;
  reciterIdRef.current = reciterId;
  onAyahChangeRef.current = onAyahChange;
  onSurahChangeRef.current = onSurahChange;
  onSurahFinishedRef.current = onSurahFinished;

  const markSkipExternalReset = useCallback(() => {
    skipExternalResetRef.current = true;
    if (skipResetTimeoutRef.current) {
      clearTimeout(skipResetTimeoutRef.current);
    }
    // If the parent never reflects the new surah, don't leave skip stuck forever.
    skipResetTimeoutRef.current = setTimeout(() => {
      skipExternalResetRef.current = false;
    }, 2500);
  }, []);

  const clearPlaybackState = useCallback(() => {
    setIsPlaying(false);
    setHasLoadedTrack(false);
    loadedKeyRef.current = null;
    pendingKeyRef.current = null;
    pendingSurahRef.current = null;
  }, []);

  const loadAndPlaySurah = useCallback(
    (targetSurah: number) => {
      try {
        setIsLoading(true);
        setIsPlaying(false);
        setHasLoadedTrack(false);
        const url = buildSurahAudioUrl(reciterIdRef.current, targetSurah);
        const key = `${reciterIdRef.current}:${targetSurah}`;
        pendingKeyRef.current = key;
        pendingSurahRef.current = targetSurah;
        SoundPlayer.playUrl(url);
      } catch (error) {
        console.log('useQuranAudioPlayer loadAndPlaySurah Error =>', error);
        setIsLoading(false);
        clearPlaybackState();
      }
    },
    [clearPlaybackState],
  );

  loadAndPlaySurahRef.current = loadAndPlaySurah;

  const playAyah = useCallback(
    (_ayahNumber?: number) => {
      loadAndPlaySurah(surahNumber);
    },
    [loadAndPlaySurah, surahNumber],
  );

  const pause = useCallback(() => {
    try {
      SoundPlayer.pause();
      setIsPlaying(false);
    } catch (error) {
      console.log('useQuranAudioPlayer pause Error =>', error);
    }
  }, []);

  const resume = useCallback(() => {
    try {
      if (!hasLoadedTrack || loadedKeyRef.current !== `${reciterId}:${surahNumber}`) {
        loadAndPlaySurah(surahNumber);
        return;
      }
      SoundPlayer.resume();
      setIsPlaying(true);
    } catch (error) {
      try {
        SoundPlayer.play();
        setIsPlaying(true);
      } catch (playError) {
        console.log('useQuranAudioPlayer resume Error =>', playError ?? error);
      }
    }
  }, [hasLoadedTrack, loadAndPlaySurah, reciterId, surahNumber]);

  const stop = useCallback(() => {
    try {
      SoundPlayer.stop();
    } catch (error) {
      console.log('useQuranAudioPlayer stop Error =>', error);
    }
    setIsLoading(false);
    clearPlaybackState();
  }, [clearPlaybackState]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
      return;
    }
    if (hasLoadedTrack && loadedKeyRef.current === `${reciterId}:${surahNumber}`) {
      resume();
      return;
    }
    playAyah();
  }, [hasLoadedTrack, isPlaying, pause, playAyah, reciterId, resume, surahNumber]);

  const playNext = useCallback(() => {
    const next = Math.min(114, surahNumber + 1);
    if (next !== surahNumber) {
      loadAndPlaySurah(next);
    } else {
      stop();
      onSurahFinishedRef.current?.();
    }
  }, [loadAndPlaySurah, stop, surahNumber]);

  const playPrevious = useCallback(() => {
    const previous = Math.max(1, surahNumber - 1);
    if (previous !== surahNumber) {
      loadAndPlaySurah(previous);
    }
  }, [loadAndPlaySurah, surahNumber]);

  useEffect(() => {
    const finishedLoading = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      ({success}) => {
        if (!pendingKeyRef.current) {
          return;
        }
        if (!success) {
          setIsLoading(false);
          clearPlaybackState();
          return;
        }

        const key = pendingKeyRef.current;
        const targetSurah = pendingSurahRef.current ?? surahNumberRef.current;
        loadedKeyRef.current = key;
        pendingKeyRef.current = null;
        pendingSurahRef.current = null;
        setHasLoadedTrack(true);
        setIsPlaying(true);
        setIsLoading(false);
        setActiveAyahNumber(1);
        onAyahChangeRef.current?.(1);

        if (targetSurah !== surahNumberRef.current) {
          markSkipExternalReset();
          onSurahChangeRef.current?.(targetSurah);
        }
      },
    );

    const finishedPlaying = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({success}) => {
        if (!success) {
          return;
        }

        const current = surahNumberRef.current;
        clearPlaybackState();
        setIsLoading(false);

        if (current < 114) {
          loadAndPlaySurahRef.current(current + 1);
          return;
        }

        onSurahFinishedRef.current?.();
      },
    );

    return () => {
      finishedLoading.remove();
      finishedPlaying.remove();
    };
  }, [clearPlaybackState, markSkipExternalReset]);

  useEffect(() => {
    if (skipExternalResetRef.current) {
      skipExternalResetRef.current = false;
      if (skipResetTimeoutRef.current) {
        clearTimeout(skipResetTimeoutRef.current);
        skipResetTimeoutRef.current = null;
      }
      setActiveAyahNumber(1);
      return;
    }

    try {
      SoundPlayer.stop();
    } catch {
      // ignore
    }
    setIsLoading(false);
    clearPlaybackState();
    setActiveAyahNumber(initialAyahNumber);
  }, [clearPlaybackState, initialAyahNumber, surahNumber, reciterId]);

  useEffect(
    () => () => {
      if (skipResetTimeoutRef.current) {
        clearTimeout(skipResetTimeoutRef.current);
      }
      try {
        SoundPlayer.stop();
      } catch {
        // ignore cleanup errors
      }
    },
    [],
  );

  return {
    activeAyahNumber,
    isPlaying,
    isLoading,
    hasLoadedTrack,
    playAyah,
    pause,
    resume,
    stop,
    togglePlay,
    playNext,
    playPrevious,
    loadAndPlaySurah,
  };
};
