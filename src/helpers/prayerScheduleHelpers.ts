import type {PrayerTimeKey, PrayerTimings} from '@Types/islamicTypes';

/** Display / reminder order for the prayer schedule. */
export const PRAYER_SCHEDULE_KEYS: readonly PrayerTimeKey[] = [
  'fajr',
  'sunrise',
  'duha',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
  'midnight',
] as const;

/** Keys typically used for adhan-style reminders (excludes sunrise). */
export const PRAYER_REMINDER_DEFAULT_KEYS: readonly PrayerTimeKey[] = [
  'fajr',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
] as const;

export type PrayerScheduleEntry = {
  key: PrayerTimeKey;
  time: string;
  /** Minutes from local midnight (0–1439). Midnight after Isha may be early AM. */
  minutes: number;
  /** Absolute Date for this occurrence on `day`. */
  at: Date;
};

/** Parse "HH:mm" (optionally with seconds) into minutes from midnight. */
export const parsePrayerTimeToMinutes = (raw: string): number | null => {
  const match = raw.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }
  return hours * 60 + minutes;
};

export const formatMinutesAsTime = (totalMinutes: number): string => {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = String(Math.floor(normalized / 60)).padStart(2, '0');
  const mm = String(normalized % 60).padStart(2, '0');
  return `${hh}:${mm}`;
};

const startOfLocalDay = (day: Date): Date => {
  const d = new Date(day);
  d.setHours(0, 0, 0, 0);
  return d;
};

const dateAtMinutes = (day: Date, minutes: number): Date => {
  const d = startOfLocalDay(day);
  d.setMinutes(minutes);
  return d;
};

/**
 * Build schedule entries for a calendar day.
 * Midnight that falls after Isha is treated as the early hours of the *next*
 * calendar day when its clock time is before Fajr (typical Aladhan output).
 */
export const buildPrayerSchedule = (
  timings: PrayerTimings,
  day: Date = new Date(),
): PrayerScheduleEntry[] => {
  const fajrMinutes = parsePrayerTimeToMinutes(timings.fajr) ?? 0;
  const entries: PrayerScheduleEntry[] = [];

  for (const key of PRAYER_SCHEDULE_KEYS) {
    const time = timings[key];
    const minutes = parsePrayerTimeToMinutes(time);
    if (minutes == null) {
      continue;
    }

    let at = dateAtMinutes(day, minutes);
    // Midnight is often 00:xx — attach to the night after Isha (next calendar day).
    if (key === 'midnight' && minutes < fajrMinutes) {
      at = dateAtMinutes(day, minutes);
      at.setDate(at.getDate() + 1);
    }

    entries.push({key, time, minutes, at});
  }

  return entries;
};

export type NextPrayerInfo = {
  key: PrayerTimeKey;
  time: string;
  at: Date;
  msRemaining: number;
};

export type CurrentPrayerInfo = {
  key: PrayerTimeKey;
  time: string;
};

/** Next upcoming prayer after `now` (wraps to tomorrow's Fajr if needed). */
export const getNextPrayer = (
  timings: PrayerTimings,
  now: Date = new Date(),
  tomorrowTimings?: PrayerTimings,
): NextPrayerInfo | null => {
  const today = buildPrayerSchedule(timings, now);
  for (const entry of today) {
    const msRemaining = entry.at.getTime() - now.getTime();
    if (msRemaining > 0) {
      return {
        key: entry.key,
        time: entry.time,
        at: entry.at,
        msRemaining,
      };
    }
  }

  const base = tomorrowTimings ?? timings;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextDay = buildPrayerSchedule(base, tomorrow);
  const fajr = nextDay.find(item => item.key === 'fajr') ?? nextDay[0];
  if (!fajr) {
    return null;
  }
  return {
    key: fajr.key,
    time: fajr.time,
    at: fajr.at,
    msRemaining: fajr.at.getTime() - now.getTime(),
  };
};

/**
 * Prayer period currently in effect: last prayer whose start is ≤ now.
 * Before Fajr, returns previous day's Isha when possible via midnight wrap.
 */
export const getCurrentPrayer = (
  timings: PrayerTimings,
  now: Date = new Date(),
): CurrentPrayerInfo | null => {
  const schedule = buildPrayerSchedule(timings, now);
  let current: PrayerScheduleEntry | null = null;
  for (const entry of schedule) {
    if (entry.at.getTime() <= now.getTime()) {
      current = entry;
    }
  }
  if (current) {
    return {key: current.key, time: current.time};
  }
  // Before today's Fajr — treat as Isha period of the previous night.
  const isha = schedule.find(item => item.key === 'isha');
  return isha ? {key: 'isha', time: isha.time} : null;
};

/** Format remaining ms as compact countdown parts. */
export const formatCountdownParts = (
  msRemaining: number,
): {hours: number; minutes: number; seconds: number} => {
  const totalSec = Math.max(0, Math.floor(msRemaining / 1000));
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return {hours, minutes, seconds};
};

export const formatClockTime = (date: Date = new Date()): string => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

/** Aladhan date path segment DD-MM-YYYY. */
export const toAladhanDateParam = (day: Date): string => {
  const dd = String(day.getDate()).padStart(2, '0');
  const mm = String(day.getMonth() + 1).padStart(2, '0');
  const yyyy = day.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export const addCalendarDays = (day: Date, delta: number): Date => {
  const next = new Date(day);
  next.setHours(12, 0, 0, 0);
  next.setDate(next.getDate() + delta);
  return next;
};

export const isSameLocalDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
