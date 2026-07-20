import {useCallback, useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import type {QuranAyahTiming} from '@helpers/quranAudioHelpers';
import {
  quranAudioController,
  type QuranAudioSnapshot,
} from '@services/quranAudioService/quranAudioController';

type UseQuranAudioPlayerArgs = {
  /** Surah the screen is displaying (may differ from the playing surah). */
  surahNumber: number;
  reciterId: string;
  /** Resume / start ayah when the user presses play on this screen. */
  initialAyahNumber?: number;
  /** mp3quran `/ayat_timing` cues for `surahNumber` (preferred). */
  ayahTimings?: readonly QuranAyahTiming[];
  /** Fallback ayah→page map when timing is unavailable for the reciter. */
  ayahPageMap?: ReadonlyArray<{ayahNumber: number; pageNumber: number}>;
  onAyahChange?: (surahNumber: number, ayahNumber: number) => void;
  onPageChange?: (pageNumber: number) => void;
  onSurahChange?: (surahNumber: number) => void;
  onSurahFinished?: () => void;
};

/**
 * Screen-facing Quran audio API — continuous surah playback.
 * Current ayah comes from mp3quran ayat_timing (React Query cached).
 * Highlight always reflects the *playing* surah, not the browsed one.
 */
export const useQuranAudioPlayer = ({
  surahNumber,
  reciterId,
  initialAyahNumber = 1,
  ayahTimings,
  ayahPageMap,
  onAyahChange,
  onPageChange,
  onSurahChange,
  onSurahFinished,
}: UseQuranAudioPlayerArgs) => {
  const [snapshot, setSnapshot] = useState<QuranAudioSnapshot>(() =>
    quranAudioController.getSnapshot(),
  );
  const callbacksRef = useRef({
    onAyahChange,
    onPageChange,
    onSurahChange,
    onSurahFinished,
  });

  useEffect(() => {
    callbacksRef.current = {
      onAyahChange,
      onPageChange,
      onSurahChange,
      onSurahFinished,
    };
  }, [onAyahChange, onPageChange, onSurahChange, onSurahFinished]);

  useEffect(() => {
    return quranAudioController.subscribe(setSnapshot);
  }, []);

  // Own the process-wide callback slot only while this screen is focused.
  useFocusEffect(
    useCallback(() => {
      return quranAudioController.setCallbacks({
        onAyahChange: (surah, ayah) => callbacksRef.current.onAyahChange?.(surah, ayah),
        onPageChange: page => callbacksRef.current.onPageChange?.(page),
        onSurahChange: surah => callbacksRef.current.onSurahChange?.(surah),
        onSurahFinished: () => callbacksRef.current.onSurahFinished?.(),
      });
    }, []),
  );

  useEffect(() => {
    quranAudioController.setTimings(ayahTimings, ayahPageMap, surahNumber);
  }, [ayahTimings, ayahPageMap, surahNumber]);

  useEffect(() => {
    quranAudioController.bindRoute(surahNumber, reciterId, initialAyahNumber);
  }, [surahNumber, reciterId, initialAyahNumber]);

  const isViewingPlayingSurah = snapshot.surahNumber === surahNumber;

  return {
    playingSurahNumber: snapshot.surahNumber,
    activeAyahNumber: snapshot.activeAyahNumber,
    isPlaying: snapshot.isPlaying,
    isLoading: snapshot.isLoading,
    hasLoadedTrack: snapshot.hasLoadedTrack,
    isViewingPlayingSurah,
    playAyah: (ayahNumber?: number) =>
      quranAudioController.playAyah(ayahNumber ?? initialAyahNumber, surahNumber, reciterId),
    pause: quranAudioController.pause,
    resume: quranAudioController.resume,
    stop: quranAudioController.stop,
    togglePlay: () => {
      if (snapshot.isPlaying && isViewingPlayingSurah) {
        quranAudioController.pause();
        return;
      }
      if (snapshot.isPlaying && !isViewingPlayingSurah) {
        quranAudioController.playAyah(initialAyahNumber, surahNumber, reciterId);
        return;
      }
      // Paused with a loaded track, but the mushaf moved — seek to the visible ayah.
      if (
        snapshot.hasLoadedTrack &&
        isViewingPlayingSurah &&
        initialAyahNumber > 0 &&
        initialAyahNumber !== snapshot.activeAyahNumber
      ) {
        quranAudioController.playAyah(initialAyahNumber, surahNumber, reciterId);
        return;
      }
      quranAudioController.togglePlay(
        isViewingPlayingSurah
          ? snapshot.activeAyahNumber || initialAyahNumber
          : initialAyahNumber,
      );
    },
    playNext: quranAudioController.playNext,
    playPrevious: quranAudioController.playPrevious,
    loadAndPlaySurah: (targetSurah: number) =>
      quranAudioController.playAyah(1, targetSurah, reciterId),
  };
};
