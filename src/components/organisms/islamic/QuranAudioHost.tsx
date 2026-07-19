import React, {useEffect, useRef} from 'react';
import {AppState} from 'react-native';

import {configureBackgroundAudioPlayback} from '@helpers/backgroundAudio';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {setLastReadPosition} from '@redux/slices/islamicSlice';
import {
  clearQuranMediaNotification,
  syncQuranMediaNotification,
} from '@services/quranAudioService/quranMediaNotification';
import {quranAudioController} from '@services/quranAudioService/quranAudioController';

/** Avoid rewriting Notifee on every ayah — that was a major lag source. */
const MEDIA_NOTIFY_MIN_MS = 4000;

/**
 * Keeps Quran audio session, last-read position, and media notification
 * alive for the whole app lifetime.
 */
const QuranAudioHost = (): null => {
  const dispatch = useAppDispatch();
  const lastPersistedRef = useRef<string>('');
  const lastMediaKeyRef = useRef<string>('');
  const lastMediaAtRef = useRef(0);
  const skipFirstSnapshotRef = useRef(true);
  const notifyQueueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    const enqueueNotification = (task: () => Promise<void>) => {
      notifyQueueRef.current = notifyQueueRef.current
        .then(task)
        .catch(() => undefined);
    };

    const unsubscribe = quranAudioController.subscribe(snapshot => {
      // subscribe() emits the current snapshot immediately. Ignore that first
      // tick so the controller's default {1,1} does not overwrite last-read.
      if (skipFirstSnapshotRef.current) {
        skipFirstSnapshotRef.current = false;
        return;
      }

      const key = `${snapshot.surahNumber}:${snapshot.activeAyahNumber}`;
      if (key !== lastPersistedRef.current && snapshot.activeAyahNumber >= 1) {
        lastPersistedRef.current = key;
        dispatch(
          setLastReadPosition({
            surahNumber: snapshot.surahNumber,
            ayahNumber: snapshot.activeAyahNumber,
          }),
        );
      }

      const mediaKey = `${snapshot.surahNumber}:${snapshot.isPlaying}:${snapshot.hasLoadedTrack}`;
      const now = Date.now();
      const shouldSyncMedia =
        mediaKey !== lastMediaKeyRef.current ||
        (snapshot.isPlaying && now - lastMediaAtRef.current >= MEDIA_NOTIFY_MIN_MS);

      if (shouldSyncMedia) {
        lastMediaKeyRef.current = mediaKey;
        lastMediaAtRef.current = now;
        const title = `Surah ${snapshot.surahNumber}`;
        const surahNumber = snapshot.surahNumber;
        const ayahNumber = snapshot.activeAyahNumber;
        const isPlaying = snapshot.isPlaying;
        enqueueNotification(() =>
          syncQuranMediaNotification({
            surahNumber,
            ayahNumber,
            isPlaying,
            surahTitle: title,
          }),
        );
      }

      if (!snapshot.isPlaying && !snapshot.hasLoadedTrack && !snapshot.isLoading) {
        lastMediaKeyRef.current = '';
        enqueueNotification(() => clearQuranMediaNotification());
      }
    });

    const appStateSub = AppState.addEventListener('change', state => {
      if (state === 'background' || state === 'inactive') {
        configureBackgroundAudioPlayback();
      }
    });

    return () => {
      unsubscribe();
      appStateSub.remove();
    };
  }, [dispatch]);

  return null;
};

export default QuranAudioHost;
