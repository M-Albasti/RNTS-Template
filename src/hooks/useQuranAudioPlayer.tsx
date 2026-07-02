import {useCallback, useEffect, useRef, useState} from 'react';
import SoundPlayer from 'react-native-sound-player';

import {buildAyahAudioUrl} from '@helpers/quranAudioHelpers';
import type {QuranAyah} from '@Types/islamicTypes';

type UseQuranAudioPlayerArgs = {
  surahNumber: number;
  ayahs: QuranAyah[];
  reciterId: string;
  initialAyahNumber?: number;
  onAyahChange?: (ayahNumber: number) => void;
};

export const useQuranAudioPlayer = ({
  surahNumber,
  ayahs,
  reciterId,
  initialAyahNumber = 1,
  onAyahChange,
}: UseQuranAudioPlayerArgs) => {
  const [activeAyahNumber, setActiveAyahNumber] = useState(initialAyahNumber);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const activeAyahRef = useRef(initialAyahNumber);

  const playAyah = useCallback(
    async (ayahNumber: number) => {
      const ayah = ayahs.find(item => item.numberInSurah === ayahNumber);
      if (!ayah) {
        return;
      }

      try {
        setIsLoading(true);
        activeAyahRef.current = ayahNumber;
        setActiveAyahNumber(ayahNumber);
        onAyahChange?.(ayahNumber);

        const url = buildAyahAudioUrl(
          reciterId,
          ayah.number,
          surahNumber,
          ayah.numberInSurah,
        );
        SoundPlayer.loadUrl(url);
        SoundPlayer.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('useQuranAudioPlayer playAyah Error =>', error);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    },
    [ayahs, onAyahChange, reciterId, surahNumber],
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
      SoundPlayer.play();
      setIsPlaying(true);
    } catch (error) {
      console.log('useQuranAudioPlayer resume Error =>', error);
    }
  }, []);

  const stop = useCallback(() => {
    try {
      SoundPlayer.stop();
      setIsPlaying(false);
    } catch (error) {
      console.log('useQuranAudioPlayer stop Error =>', error);
    }
  }, []);

  const playNext = useCallback(() => {
    const currentIndex = ayahs.findIndex(item => item.numberInSurah === activeAyahRef.current);
    const next = ayahs[currentIndex + 1];
    if (next) {
      playAyah(next.numberInSurah);
    } else {
      stop();
    }
  }, [ayahs, playAyah, stop]);

  const playPrevious = useCallback(() => {
    const currentIndex = ayahs.findIndex(item => item.numberInSurah === activeAyahRef.current);
    const previous = ayahs[currentIndex - 1];
    if (previous) {
      playAyah(previous.numberInSurah);
    }
  }, [ayahs, playAyah]);

  useEffect(() => {
    const finished = SoundPlayer.addEventListener('FinishedPlaying', ({success}) => {
      if (success) {
        playNext();
      }
    });
    return () => finished.remove();
  }, [playNext]);

  useEffect(() => {
    activeAyahRef.current = initialAyahNumber;
    setActiveAyahNumber(initialAyahNumber);
  }, [initialAyahNumber, surahNumber]);

  useEffect(
    () => () => {
      stop();
    },
    [stop],
  );

  return {
    activeAyahNumber,
    isPlaying,
    isLoading,
    playAyah,
    pause,
    resume,
    stop,
    playNext,
    playPrevious,
  };
};
