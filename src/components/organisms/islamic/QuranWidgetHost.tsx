import React, {useEffect} from 'react';

import {useAppSelector} from '@hooks/useAppSelector';
import {quranAudioController} from '@services/quranAudioService/quranAudioController';
import {
  bindQuranWidgetPlayback,
  registerQuranWidgetBridge,
  syncQuranHomeWidget,
} from '@services/quranAudioService/quranWidgetBridge';

/**
 * Binds the process-wide Quran audio controller to home-screen widgets
 * and registers deep-link / native event handlers.
 */
const QuranWidgetHost = (): null => {
  const reciterId = useAppSelector(state => state.islamic.quranPreferences.reciterId);
  const lastRead = useAppSelector(state => state.islamic.lastRead);

  useEffect(() => {
    return registerQuranWidgetBridge();
  }, []);

  useEffect(() => {
    if (reciterId && lastRead?.surahNumber) {
      quranAudioController.bindRoute(
        lastRead.surahNumber,
        reciterId,
        lastRead.ayahNumber ?? 1,
      );
    }
  }, [lastRead?.ayahNumber, lastRead?.surahNumber, reciterId]);

  useEffect(() => {
    bindQuranWidgetPlayback({
      resume: () => {
        const snap = quranAudioController.getSnapshot();
        if (!snap.reciterId && reciterId) {
          quranAudioController.bindRoute(
            snap.surahNumber || lastRead?.surahNumber || 1,
            reciterId,
            snap.activeAyahNumber || lastRead?.ayahNumber || 1,
          );
        }
        quranAudioController.resume();
      },
      pause: () => quranAudioController.pause(),
      togglePlay: () => {
        const snap = quranAudioController.getSnapshot();
        if (!snap.hasLoadedTrack && !snap.isPlaying) {
          const surah = snap.surahNumber || lastRead?.surahNumber || 1;
          const ayah = snap.activeAyahNumber || lastRead?.ayahNumber || 1;
          const reciter = snap.reciterId || reciterId;
          if (reciter) {
            quranAudioController.playAyah(ayah, surah, reciter);
            return;
          }
        }
        quranAudioController.togglePlay();
      },
      playNext: () => quranAudioController.playNext(),
      playPrevious: () => quranAudioController.playPrevious(),
      stop: () => quranAudioController.stop(),
      toggleRepeat: () => quranAudioController.toggleRepeat(),
      getSnapshot: () => {
        const snap = quranAudioController.getSnapshot();
        return {
          surahNumber: snap.surahNumber || lastRead?.surahNumber || 1,
          ayahNumber: snap.activeAyahNumber || lastRead?.ayahNumber || 1,
          isPlaying: snap.isPlaying,
          isRepeatEnabled: snap.isRepeatEnabled,
          title: `Surah ${snap.surahNumber || lastRead?.surahNumber || 1}`,
        };
      },
    });

    const unsubscribe = quranAudioController.subscribe(snapshot => {
      syncQuranHomeWidget({
        surahNumber: snapshot.surahNumber,
        ayahNumber: snapshot.activeAyahNumber,
        isPlaying: snapshot.isPlaying,
        isRepeatEnabled: snapshot.isRepeatEnabled,
        title: `Surah ${snapshot.surahNumber}`,
      });
    });

    return () => {
      unsubscribe();
      bindQuranWidgetPlayback(null);
    };
  }, [lastRead?.ayahNumber, lastRead?.surahNumber, reciterId]);

  return null;
};

export default QuranWidgetHost;
