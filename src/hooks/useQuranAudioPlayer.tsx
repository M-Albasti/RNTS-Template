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
  /** When we advance surah ourselves, skip the hard reset so audio keeps playing. */
  const skipExternalResetRef = useRef(false);
  const surahNumberRef = useRef(surahNumber);
  surahNumberRef.current = surahNumber;

  const loadAndPlaySurah = useCallback(
    async (targetSurah: number) => {
      try {
        setIsLoading(true);
        const url = buildSurahAudioUrl(reciterId, targetSurah);
        const key = `${reciterId}:${targetSurah}`;
        SoundPlayer.playUrl(url);
        loadedKeyRef.current = key;
        setHasLoadedTrack(true);
        setIsPlaying(true);
        setActiveAyahNumber(1);
        onAyahChange?.(1);
        if (targetSurah !== surahNumberRef.current) {
          skipExternalResetRef.current = true;
          onSurahChange?.(targetSurah);
        }
      } catch (error) {
        console.log('useQuranAudioPlayer loadAndPlaySurah Error =>', error);
        setIsPlaying(false);
        setHasLoadedTrack(false);
      } finally {
        setIsLoading(false);
      }
    },
    [onAyahChange, onSurahChange, reciterId],
  );

  const playAyah = useCallback(
    async (_ayahNumber?: number) => {
      await loadAndPlaySurah(surahNumber);
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
      // Some platforms only expose play() after pause.
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
      setIsPlaying(false);
      setHasLoadedTrack(false);
      loadedKeyRef.current = null;
    } catch (error) {
      console.log('useQuranAudioPlayer stop Error =>', error);
    }
  }, []);

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

  /** Previous / next = adjacent surah (continuous chapter playback). */
  const playNext = useCallback(() => {
    const next = Math.min(114, surahNumber + 1);
    if (next !== surahNumber) {
      loadAndPlaySurah(next);
    } else {
      stop();
      onSurahFinished?.();
    }
  }, [loadAndPlaySurah, onSurahFinished, stop, surahNumber]);

  const playPrevious = useCallback(() => {
    const previous = Math.max(1, surahNumber - 1);
    if (previous !== surahNumber) {
      loadAndPlaySurah(previous);
    }
  }, [loadAndPlaySurah, surahNumber]);

  useEffect(() => {
    const finished = SoundPlayer.addEventListener('FinishedPlaying', ({success}) => {
      if (success) {
        onSurahFinished?.();
        setIsPlaying(false);
      }
    });
    return () => finished.remove();
  }, [onSurahFinished]);

  useEffect(() => {
    if (skipExternalResetRef.current) {
      skipExternalResetRef.current = false;
      setActiveAyahNumber(1);
      return;
    }

    try {
      SoundPlayer.stop();
    } catch {
      // ignore
    }
    setActiveAyahNumber(initialAyahNumber);
    setHasLoadedTrack(false);
    loadedKeyRef.current = null;
    setIsPlaying(false);
  }, [initialAyahNumber, surahNumber, reciterId]);

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
