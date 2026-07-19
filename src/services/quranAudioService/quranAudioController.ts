import SoundPlayer from 'react-native-sound-player';

import {mp3quranClient} from '@api/clients/mp3quranClient';
import {queryClient} from '@api/query/queryClient';
import {queryKeys} from '@api/query/queryKeys';
import {configureBackgroundAudioPlayback} from '@helpers/backgroundAudio';
import {
  buildProportionalTimings,
  buildSurahAudioUrl,
  findTimingForAyah,
  findTimingIndexAtMs,
  getSurahAyahCount,
  msUntilNextAyah,
  type QuranAyahTiming,
} from '@helpers/quranAudioHelpers';
import {getTimingReadId} from '@constants/quranReciters';

export type QuranAudioSnapshot = {
  /** Surah of the continuous file currently loaded / playing. */
  surahNumber: number;
  reciterId: string;
  activeAyahNumber: number;
  isPlaying: boolean;
  isLoading: boolean;
  hasLoadedTrack: boolean;
  /** When true, finished surahs restart instead of advancing. */
  isRepeatEnabled: boolean;
};

type QuranAudioListener = (snapshot: QuranAudioSnapshot) => void;

type QuranAudioCallbacks = {
  onAyahChange?: (surahNumber: number, ayahNumber: number) => void;
  onPageChange?: (pageNumber: number) => void;
  onSurahChange?: (surahNumber: number) => void;
  onSurahFinished?: () => void;
  onSnapshotChange?: (snapshot: QuranAudioSnapshot) => void;
};

/**
 * Soft re-sync from the native player every N ayah advances.
 * More frequent on long surahs so the indicator cannot race ahead of audio.
 */
const REANCHOR_EVERY_AYAHS = 4;
/** Let the native player fully release before the next playUrl (avoids تشويش / 2x). */
const STOP_SETTLE_MS = 280;
/**
 * Highlight trails the audible position. Pure API timers drift early on long
 * surahs (e.g. Yusuf) — lag + player-based scheduling keep the indicator behind.
 */
const HIGHLIGHT_LAG_MS = 800;
const TIMING_STALE_MS = 1000 * 60 * 60 * 24;

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Process-wide Quran player.
 *
 * Audio: continuous surah MP3 (mp3quran).
 * Highlight: mp3quran `/ayat_timing` cues + scheduled ayah clock
 * (one timeout per boundary — no getInfo polling loop).
 */
class QuranAudioController {
  private snapshot: QuranAudioSnapshot = {
    surahNumber: 1,
    reciterId: '',
    activeAyahNumber: 1,
    isPlaying: false,
    isLoading: false,
    hasLoadedTrack: false,
    isRepeatEnabled: false,
  };

  private listeners = new Set<QuranAudioListener>();
  private callbacks: QuranAudioCallbacks = {};
  /** Monotonic owner id so only the latest registrant may clear callbacks. */
  private callbackOwnerId = 0;
  /** Official ms cues from mp3quran ayat_timing for the playing surah. */
  private ayahTimings: readonly QuranAyahTiming[] | undefined;
  private timingsSurah: number | null = null;
  private ayahPageMap: ReadonlyArray<{ayahNumber: number; pageNumber: number}> | undefined;
  private pageMapSurah: number | null = null;
  private boundRouteSurah: number | null = null;
  private resolvedTimings: QuranAyahTiming[] = [];
  private timingIndex = -1;
  private ayahsSinceAnchor = 0;
  private scheduleTimer: ReturnType<typeof setTimeout> | null = null;
  private getInfoInFlight = false;
  private timingFetchGeneration = 0;
  private loadedKey: string | null = null;
  private pendingKey: string | null = null;
  private pendingUrl: string | null = null;
  private pendingSurah: number | null = null;
  private pendingSeekAyah: number | null = null;
  private previousSurahForNotify: number | null = null;
  private activePage: number | null = null;
  private bootstrapped = false;
  private trackDurationSec = 0;
  private playbackGeneration = 0;
  /**
   * While true, ignore FinishedPlaying — SoundPlayer.stop() often emits a
   * finish event that would otherwise start a second overlapping stream (2x).
   */
  private ignoreFinishedPlaying = false;

  subscribe = (listener: QuranAudioListener): (() => void) => {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): QuranAudioSnapshot => this.snapshot;

  /**
   * Register screen-owned callbacks. Returns a disposer that clears them only
   * if this registration is still the active owner (blur / unmount safe).
   */
  setCallbacks = (callbacks: QuranAudioCallbacks): (() => void) => {
    const ownerId = ++this.callbackOwnerId;
    this.callbacks = {...callbacks};
    return () => {
      if (this.callbackOwnerId === ownerId) {
        this.callbacks = {};
      }
    };
  };

  /**
   * Apply API timings / page map for a surah.
   * Ignored when it belongs to a surah that is not currently playing
   * (browsing another surah must not wipe the live clock).
   */
  setTimings = (
    ayahTimings: readonly QuranAyahTiming[] | undefined,
    ayahPageMap?: ReadonlyArray<{ayahNumber: number; pageNumber: number}>,
    forSurahNumber?: number,
  ) => {
    const targetSurah = forSurahNumber ?? this.snapshot.surahNumber;
    const audioBusy =
      this.snapshot.isPlaying || this.snapshot.isLoading || this.snapshot.hasLoadedTrack;

    if (audioBusy && targetSurah !== this.snapshot.surahNumber) {
      return;
    }

    if (ayahPageMap) {
      this.ayahPageMap = ayahPageMap;
      this.pageMapSurah = targetSurah;
    }

    if (ayahTimings?.length) {
      this.ayahTimings = ayahTimings;
      this.timingsSurah = targetSurah;
    }

    this.rebuildResolvedTimings();

    if (this.snapshot.isPlaying && this.resolvedTimings.length) {
      // Timings arrived (or refreshed) mid-play — single soft re-anchor.
      void this.reanchorFromPlayer();
    } else if (
      this.snapshot.hasLoadedTrack &&
      this.snapshot.isPlaying === false &&
      this.resolvedTimings.length
    ) {
      // Keep highlight aligned while paused when cues load.
      const cue = findTimingForAyah(this.resolvedTimings, this.snapshot.activeAyahNumber);
      if (cue) {
        this.applySyncCue(cue, true);
      }
    }
  };

  setPageMap = (
    ayahPageMap: ReadonlyArray<{ayahNumber: number; pageNumber: number}> | undefined,
    forSurahNumber?: number,
  ) => {
    this.setTimings(undefined, ayahPageMap, forSurahNumber);
  };

  /**
   * UI navigated to a surah. Never mutates playing ayah/surah while audio is active.
   */
  bindRoute = (surahNumber: number, reciterId: string, _resumeAyahNumber = 1) => {
    this.ensureBootstrapped();
    this.boundRouteSurah = surahNumber;

    const audioBusy =
      this.snapshot.isPlaying || this.snapshot.isLoading || this.snapshot.hasLoadedTrack;

    if (audioBusy) {
      if (reciterId && reciterId !== this.snapshot.reciterId) {
        this.playAyah(
          this.snapshot.activeAyahNumber,
          this.snapshot.surahNumber,
          reciterId,
        );
      }
      return;
    }

    this.patchSnapshot({
      surahNumber,
      reciterId,
      activeAyahNumber:
        surahNumber === this.snapshot.surahNumber ? this.snapshot.activeAyahNumber : 1,
      hasLoadedTrack: false,
    });
    this.loadedKey = null;
  };

  playAyah = (ayahNumber = 1, surahNumber?: number, reciterId?: string) => {
    this.ensureBootstrapped();
    const targetSurah = surahNumber ?? this.snapshot.surahNumber;
    const targetReciter = reciterId || this.snapshot.reciterId;
    if (!targetReciter) {
      return;
    }
    const maxAyah = getSurahAyahCount(targetSurah) || 1;
    const targetAyah = Math.min(maxAyah, Math.max(1, ayahNumber));
    const key = `${targetReciter}:${targetSurah}`;

    if (this.snapshot.hasLoadedTrack && this.loadedKey === key && !this.snapshot.isLoading) {
      this.patchSnapshot({
        surahNumber: targetSurah,
        reciterId: targetReciter,
        activeAyahNumber: targetAyah,
      });
      this.callbacks.onAyahChange?.(targetSurah, targetAyah);
      void this.seekToAyah(targetAyah).then(() => {
        if (!this.snapshot.isPlaying) {
          this.resume();
        } else {
          this.startAyahClockAtAyah(targetAyah);
        }
      });
      return;
    }

    void this.loadAndPlaySurah(targetSurah, targetReciter, targetAyah);
  };

  togglePlay = (resumeAyahNumber?: number) => {
    if (this.snapshot.isPlaying) {
      this.pause();
      return;
    }
    if (
      this.snapshot.hasLoadedTrack &&
      this.loadedKey === `${this.snapshot.reciterId}:${this.snapshot.surahNumber}`
    ) {
      this.resume();
      return;
    }
    this.playAyah(resumeAyahNumber ?? (this.snapshot.activeAyahNumber || 1));
  };

  pause = () => {
    this.stopAyahClock();
    try {
      SoundPlayer.pause();
    } catch (error) {
      console.log('quranAudioController.pause Error =>', error);
    }
    this.patchSnapshot({isPlaying: false});
  };

  resume = () => {
    try {
      configureBackgroundAudioPlayback();
      SoundPlayer.resume();
      this.patchSnapshot({isPlaying: true});
      void this.reanchorFromPlayer();
    } catch (error) {
      // Never fall back to play() — that can stack a second stream (2x / تشويش).
      console.log('quranAudioController.resume Error =>', error);
      this.recoverBrokenPlayer();
    }
  };

  stop = () => {
    this.stopAyahClock();
    this.playbackGeneration += 1;
    this.timingFetchGeneration += 1;
    this.ignoreFinishedPlaying = true;
    try {
      SoundPlayer.stop();
    } catch (error) {
      console.log('quranAudioController.stop Error =>', error);
    }
    this.resetLoadState();
    this.patchSnapshot({
      isPlaying: false,
      isLoading: false,
      hasLoadedTrack: false,
    });
  };

  playNext = () => {
    const next = Math.min(114, this.snapshot.surahNumber + 1);
    if (next !== this.snapshot.surahNumber) {
      void this.loadAndPlaySurah(next, this.snapshot.reciterId, 1);
      return;
    }
    this.stop();
    this.callbacks.onSurahFinished?.();
  };

  playPrevious = () => {
    const previous = Math.max(1, this.snapshot.surahNumber - 1);
    if (previous !== this.snapshot.surahNumber) {
      void this.loadAndPlaySurah(previous, this.snapshot.reciterId, 1);
    }
  };

  toggleRepeat = () => {
    this.patchSnapshot({isRepeatEnabled: !this.snapshot.isRepeatEnabled});
  };

  setRepeatEnabled = (enabled: boolean) => {
    this.patchSnapshot({isRepeatEnabled: enabled});
  };

  private loadAndPlaySurah = async (
    targetSurah: number,
    reciterId: string,
    seekAyah: number,
  ) => {
    this.playbackGeneration += 1;
    const generation = this.playbackGeneration;
    this.stopAyahClock();
    this.timingFetchGeneration += 1;

    const previousSurah = this.snapshot.surahNumber;
    // Flip UI to the next surah immediately (before settle) so the ayah
    // indicator never disappears across continuous surah boundaries.
    this.patchSnapshot({
      surahNumber: targetSurah,
      reciterId,
      activeAyahNumber: seekAyah,
      isLoading: true,
      isPlaying: false,
      hasLoadedTrack: false,
    });
    this.callbacks.onAyahChange?.(targetSurah, seekAyah);
    if (
      previousSurah !== targetSurah &&
      this.boundRouteSurah === previousSurah
    ) {
      this.callbacks.onSurahChange?.(targetSurah);
    }
    // Already notified — prevent a second onSurahChange after URL load.
    this.previousSurahForNotify = null;
    // Block finish events from stop() so we do not chain another load (2x audio).
    this.ignoreFinishedPlaying = true;

    try {
      SoundPlayer.stop();
    } catch {
      // ignore
    }

    await wait(STOP_SETTLE_MS);
    if (generation !== this.playbackGeneration) {
      return;
    }

    try {
      configureBackgroundAudioPlayback();
      this.activePage = null;
      this.trackDurationSec = 0;
      // Keep cached timings if they already match this surah; otherwise clear.
      if (this.timingsSurah !== targetSurah) {
        this.ayahTimings = undefined;
        this.timingsSurah = null;
        this.resolvedTimings = [];
      }
      const url = buildSurahAudioUrl(reciterId, targetSurah);
      const key = `${reciterId}:${targetSurah}`;
      this.pendingKey = key;
      this.pendingUrl = url;
      this.pendingSurah = targetSurah;
      this.pendingSeekAyah = seekAyah;
      this.loadedKey = null;
      // Warm / fetch ayat_timing via React Query cache (shared with UI hooks).
      void this.ensureTimingsForSurah(targetSurah, reciterId);
      this.prefetchNeighborTimings(targetSurah, reciterId);
      SoundPlayer.playUrl(url);
      // ignoreFinishedPlaying cleared in FinishedLoadingURL once the new file is ready.
    } catch (error) {
      console.log('quranAudioController.loadAndPlaySurah Error =>', error);
      this.ignoreFinishedPlaying = false;
      if (generation === this.playbackGeneration) {
        this.resetLoadState();
        this.patchSnapshot({isLoading: false, isPlaying: false, hasLoadedTrack: false});
      }
    }
  };

  /** Fetch ayat_timing through the shared Query cache (deduped + 24h stale). */
  private ensureTimingsForSurah = async (surahNumber: number, reciterId: string) => {
    const fetchId = ++this.timingFetchGeneration;
    const readId = getTimingReadId(reciterId);

    if (readId == null) {
      if (this.snapshot.surahNumber === surahNumber) {
        this.ayahTimings = undefined;
        this.timingsSurah = null;
        this.rebuildResolvedTimings();
      }
      return;
    }

    try {
      const cues = await queryClient.fetchQuery({
        queryKey: queryKeys.islamic.quranAyahTiming(surahNumber, readId),
        queryFn: () => mp3quranClient.getSurahAyahTiming(surahNumber, readId),
        staleTime: TIMING_STALE_MS,
      });

      if (
        fetchId !== this.timingFetchGeneration ||
        this.snapshot.surahNumber !== surahNumber
      ) {
        return;
      }

      this.ayahTimings = cues;
      this.timingsSurah = surahNumber;
      this.rebuildResolvedTimings();

      if (this.snapshot.isPlaying && this.resolvedTimings.length) {
        void this.reanchorFromPlayer();
      } else if (this.snapshot.hasLoadedTrack && this.resolvedTimings.length) {
        this.startAyahClockAtAyah(this.snapshot.activeAyahNumber);
      }
    } catch (error) {
      console.log('quranAudioController.ensureTimingsForSurah Error =>', error);
    }
  };

  /** Prefetch next/prev surah timings so continuous advance stays snappy. */
  private prefetchNeighborTimings = (surahNumber: number, reciterId: string) => {
    const readId = getTimingReadId(reciterId);
    if (readId == null) {
      return;
    }
    for (const neighbor of [surahNumber + 1, surahNumber - 1]) {
      if (neighbor < 1 || neighbor > 114) {
        continue;
      }
      void queryClient.prefetchQuery({
        queryKey: queryKeys.islamic.quranAyahTiming(neighbor, readId),
        queryFn: () => mp3quranClient.getSurahAyahTiming(neighbor, readId),
        staleTime: TIMING_STALE_MS,
      });
    }
  };

  private seekToAyah = async (ayahNumber: number): Promise<void> => {
    this.stopAyahClock();
    try {
      if (!this.resolvedTimings.length) {
        const info = await this.safeGetInfo();
        if (info) {
          this.trackDurationSec = info.duration;
        }
        this.rebuildResolvedTimings();
      }
      const cue = findTimingForAyah(this.resolvedTimings, ayahNumber);
      if (!cue) {
        return;
      }
      SoundPlayer.seek(Math.max(0, cue.startMs / 1000));
      this.applySyncCue(cue, true);
      this.timingIndex = this.resolvedTimings.findIndex(
        item => item.ayahNumber === cue.ayahNumber,
      );
    } catch (error) {
      console.log('quranAudioController.seekToAyah Error =>', error);
    }
  };

  private rebuildResolvedTimings = () => {
    // Prefer official API cues — absolute ms on the continuous file.
    if (
      this.ayahTimings?.length &&
      (this.timingsSurah == null || this.timingsSurah === this.snapshot.surahNumber)
    ) {
      this.resolvedTimings = this.ayahTimings.slice();
      return;
    }

    const durationMs = this.trackDurationSec * 1000;
    if (durationMs <= 0) {
      this.resolvedTimings = [];
      return;
    }

    if (this.ayahPageMap?.length && this.pageMapSurah === this.snapshot.surahNumber) {
      this.resolvedTimings = buildProportionalTimings(this.ayahPageMap, durationMs);
      return;
    }

    const count = getSurahAyahCount(this.snapshot.surahNumber);
    if (count > 0) {
      const pages = Array.from({length: count}, (_, i) => ({
        ayahNumber: i + 1,
        pageNumber: 1,
      }));
      this.resolvedTimings = buildProportionalTimings(pages, durationMs);
      return;
    }

    this.resolvedTimings = [];
  };

  private startAyahClockAtAyah = (ayahNumber: number) => {
    this.stopAyahClock();
    if (!this.resolvedTimings.length) {
      return;
    }
    const index = this.resolvedTimings.findIndex(item => item.ayahNumber === ayahNumber);
    this.timingIndex = index >= 0 ? index : 0;
    const cue = this.resolvedTimings[this.timingIndex];
    if (cue) {
      this.applySyncCue(cue, true);
    }
    this.ayahsSinceAnchor = 0;
    if (!this.snapshot.isPlaying) {
      return;
    }
    this.scheduleNextAyah();
  };

  private startAyahClockFromMs = (timeMs: number) => {
    this.stopAyahClock();
    if (!this.resolvedTimings.length) {
      return;
    }
    // Trail the audible position so the indicator is not ahead of the reader.
    const effectiveMs = Math.max(0, timeMs - HIGHLIGHT_LAG_MS);
    this.timingIndex = findTimingIndexAtMs(this.resolvedTimings, effectiveMs);
    const cue = this.resolvedTimings[this.timingIndex];
    if (cue) {
      this.applySyncCue(cue, true);
    }
    this.ayahsSinceAnchor = 0;
    if (!this.snapshot.isPlaying) {
      return;
    }
    void this.scheduleNextAyahFromPlayer();
  };

  /**
   * Schedule the next highlight using the live player clock (not only API deltas).
   * Long surahs like Yusuf drift badly if we trust wall-clock timeouts alone.
   */
  private scheduleNextAyahFromPlayer = async () => {
    this.stopAyahClock();
    const next = this.resolvedTimings[this.timingIndex + 1];
    if (!next || !this.snapshot.isPlaying) {
      return;
    }

    const info = await this.safeGetInfo();
    if (!this.snapshot.isPlaying) {
      return;
    }

    let delay: number;
    if (info) {
      const nowMs = Math.max(0, info.currentTime * 1000);
      // Wait until audio actually reaches the next cue + lag.
      delay = Math.max(80, next.startMs - nowMs + HIGHLIGHT_LAG_MS);
    } else {
      const tableDelay = msUntilNextAyah(this.resolvedTimings, this.timingIndex);
      if (tableDelay == null) {
        return;
      }
      delay = tableDelay + HIGHLIGHT_LAG_MS;
    }

    this.scheduleTimer = setTimeout(() => {
      void this.advanceAyah();
    }, delay);
  };

  private scheduleNextAyah = () => {
    void this.scheduleNextAyahFromPlayer();
  };

  private advanceAyah = async () => {
    if (!this.snapshot.isPlaying) {
      return;
    }
    const nextIndex = this.timingIndex + 1;
    const nextCue = this.resolvedTimings[nextIndex];
    if (!nextCue) {
      return;
    }

    // Gate: if the reader has not reached this ayah yet, wait again (no jump-ahead).
    const info = await this.safeGetInfo();
    if (!this.snapshot.isPlaying) {
      return;
    }
    if (info) {
      const nowMs = Math.max(0, info.currentTime * 1000);
      const earliestHighlightMs = nextCue.startMs + HIGHLIGHT_LAG_MS;
      if (nowMs + 40 < earliestHighlightMs) {
        this.scheduleTimer = setTimeout(() => {
          void this.advanceAyah();
        }, Math.max(80, earliestHighlightMs - nowMs));
        return;
      }
    }

    this.timingIndex = nextIndex;
    this.applySyncCue(nextCue);
    this.ayahsSinceAnchor += 1;

    if (this.ayahsSinceAnchor >= REANCHOR_EVERY_AYAHS) {
      void this.reanchorFromPlayer();
      return;
    }
    void this.scheduleNextAyahFromPlayer();
  };

  private reanchorFromPlayer = async () => {
    if (!this.snapshot.isPlaying || this.getInfoInFlight) {
      return;
    }
    this.getInfoInFlight = true;
    try {
      const info = await this.safeGetInfo();
      if (!info || !this.snapshot.isPlaying) {
        return;
      }
      this.trackDurationSec = info.duration;
      // API cues don't depend on duration; only rebuild if we need proportional fallback.
      if (!this.ayahTimings?.length) {
        this.rebuildResolvedTimings();
      }
      if (!this.resolvedTimings.length) {
        this.rebuildResolvedTimings();
      }
      if (!this.resolvedTimings.length) {
        return;
      }
      this.startAyahClockFromMs(Math.max(0, info.currentTime * 1000));
    } finally {
      this.getInfoInFlight = false;
    }
  };

  private safeGetInfo = async (): Promise<{currentTime: number; duration: number} | null> => {
    try {
      return await SoundPlayer.getInfo();
    } catch {
      return null;
    }
  };

  private applySyncCue = (cue: QuranAyahTiming, force = false) => {
    if (cue.ayahNumber >= 1 && cue.ayahNumber !== this.snapshot.activeAyahNumber) {
      this.patchSnapshot({activeAyahNumber: cue.ayahNumber});
      this.callbacks.onAyahChange?.(this.snapshot.surahNumber, cue.ayahNumber);
    } else if (force && cue.ayahNumber >= 1) {
      // Same ayah — keep snapshot; still allow page follow below.
    }
    if (
      this.boundRouteSurah != null &&
      this.boundRouteSurah !== this.snapshot.surahNumber
    ) {
      return;
    }
    if (this.pageMapSurah != null && this.pageMapSurah !== this.snapshot.surahNumber) {
      return;
    }
    if (cue.pageNumber >= 1 && (force || cue.pageNumber !== this.activePage)) {
      if (cue.pageNumber !== this.activePage) {
        this.activePage = cue.pageNumber;
        this.callbacks.onPageChange?.(cue.pageNumber);
      }
    }
  };

  private stopAyahClock = () => {
    if (this.scheduleTimer) {
      clearTimeout(this.scheduleTimer);
      this.scheduleTimer = null;
    }
  };

  private resetLoadState = () => {
    this.loadedKey = null;
    this.pendingKey = null;
    this.pendingUrl = null;
    this.pendingSurah = null;
    this.pendingSeekAyah = null;
    this.activePage = null;
    this.timingIndex = -1;
    this.ayahsSinceAnchor = 0;
    this.resolvedTimings = [];
    this.trackDurationSec = 0;
  };

  private recoverBrokenPlayer = () => {
    this.stopAyahClock();
    this.playbackGeneration += 1;
    this.timingFetchGeneration += 1;
    this.ignoreFinishedPlaying = true;
    try {
      SoundPlayer.stop();
    } catch {
      // ignore
    }
    this.resetLoadState();
    this.patchSnapshot({
      isPlaying: false,
      isLoading: false,
      hasLoadedTrack: false,
    });
  };

  private ensureBootstrapped = () => {
    if (this.bootstrapped) {
      return;
    }
    this.bootstrapped = true;

    SoundPlayer.addEventListener('FinishedLoadingURL', ({success, url}) => {
      if (!this.pendingKey) {
        return;
      }
      // Reject stale load events from a previous playUrl.
      if (url && this.pendingUrl && url !== this.pendingUrl) {
        return;
      }

      // Capture before clearing pending so async work can detect supersession.
      const generationAtEvent = this.playbackGeneration;
      const loadedKey = this.pendingKey;
      const targetSurah = this.pendingSurah ?? this.snapshot.surahNumber;
      const seekAyah = this.pendingSeekAyah ?? 1;
      const previousSurah = this.previousSurahForNotify;

      if (!success) {
        this.ignoreFinishedPlaying = false;
        this.resetLoadState();
        this.patchSnapshot({isLoading: false, isPlaying: false, hasLoadedTrack: false});
        return;
      }

      this.loadedKey = loadedKey;
      this.pendingKey = null;
      this.pendingUrl = null;
      this.pendingSurah = null;
      this.pendingSeekAyah = null;
      this.previousSurahForNotify = null;
      // New file is loaded — safe to honor real end-of-track events again.
      this.ignoreFinishedPlaying = false;

      this.patchSnapshot({
        surahNumber: targetSurah,
        hasLoadedTrack: true,
        isPlaying: true,
        isLoading: false,
        activeAyahNumber: seekAyah,
      });
      this.callbacks.onAyahChange?.(targetSurah, seekAyah);

      // Fallback if loadAndPlaySurah did not already notify (e.g. first play).
      if (
        previousSurah != null &&
        previousSurah !== targetSurah &&
        this.boundRouteSurah === previousSurah
      ) {
        this.callbacks.onSurahChange?.(targetSurah);
      }

      void (async () => {
        // Duration only needed for proportional fallback; API cues are absolute.
        if (!this.ayahTimings?.length || this.timingsSurah !== targetSurah) {
          const info = await this.safeGetInfo();
          if (generationAtEvent !== this.playbackGeneration) {
            return;
          }
          if (info) {
            this.trackDurationSec = info.duration;
          }
        }
        if (generationAtEvent !== this.playbackGeneration) {
          return;
        }
        this.rebuildResolvedTimings();

        if (seekAyah > 1) {
          const cue = findTimingForAyah(this.resolvedTimings, seekAyah);
          if (cue) {
            try {
              SoundPlayer.seek(Math.max(0, cue.startMs / 1000));
            } catch {
              // seek may fail briefly after load
            }
            if (generationAtEvent !== this.playbackGeneration) {
              return;
            }
            this.applySyncCue(cue, true);
            this.startAyahClockAtAyah(seekAyah);
            return;
          }
        }

        if (generationAtEvent !== this.playbackGeneration) {
          return;
        }

        if (this.resolvedTimings.length) {
          this.startAyahClockAtAyah(seekAyah);
          return;
        }

        // Timings still in flight — clock starts when ensureTimingsForSurah finishes.
        const info = await this.safeGetInfo();
        if (generationAtEvent !== this.playbackGeneration) {
          return;
        }
        if (info && this.resolvedTimings.length) {
          this.startAyahClockFromMs(Math.max(0, info.currentTime * 1000));
        }
      })();
    });

    SoundPlayer.addEventListener('FinishedPlaying', ({success}) => {
      // stop()/playUrl handoff emits stale finishes — ignoring those prevents
      // overlapping streams that sound like 2x / مشوش audio.
      if (this.ignoreFinishedPlaying || this.pendingKey || this.snapshot.isLoading) {
        return;
      }

      this.stopAyahClock();
      const current = this.snapshot.surahNumber;
      const reciterId = this.snapshot.reciterId;

      if (!success) {
        this.recoverBrokenPlayer();
        return;
      }

      if (!this.loadedKey || !this.snapshot.hasLoadedTrack) {
        return;
      }

      // Repeat current surah, otherwise advance without clearing UI to idle.
      if (this.snapshot.isRepeatEnabled && reciterId) {
        void this.loadAndPlaySurah(current, reciterId, 1);
        return;
      }

      if (current < 114 && reciterId) {
        void this.loadAndPlaySurah(current + 1, reciterId, 1);
        return;
      }

      this.loadedKey = null;
      this.patchSnapshot({isPlaying: false, hasLoadedTrack: false, isLoading: false});
      this.callbacks.onSurahFinished?.();
    });
  };

  private patchSnapshot = (partial: Partial<QuranAudioSnapshot>) => {
    const next = {...this.snapshot, ...partial};
    if (
      next.surahNumber === this.snapshot.surahNumber &&
      next.reciterId === this.snapshot.reciterId &&
      next.activeAyahNumber === this.snapshot.activeAyahNumber &&
      next.isPlaying === this.snapshot.isPlaying &&
      next.isLoading === this.snapshot.isLoading &&
      next.hasLoadedTrack === this.snapshot.hasLoadedTrack &&
      next.isRepeatEnabled === this.snapshot.isRepeatEnabled
    ) {
      return;
    }
    this.snapshot = next;
    this.listeners.forEach(listener => listener(this.snapshot));
    this.callbacks.onSnapshotChange?.(this.snapshot);
  };
}

export const quranAudioController = new QuranAudioController();
