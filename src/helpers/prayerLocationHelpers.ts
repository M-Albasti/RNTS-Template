import {defaultPrayerLocation} from '@redux/slices/islamicSlice';
import type {PrayerLocation} from '@Types/islamicTypes';

type IslamicPrayerSlice = {
  prayerCity?: string;
  prayerCountry?: string;
  prayerLocation?: PrayerLocation;
};

/**
 * Resolve prayer location from Redux, including legacy city/country-only persists.
 */
export const resolvePrayerLocation = (slice: IslamicPrayerSlice): PrayerLocation => {
  const stored = slice.prayerLocation;
  if (stored?.mode && stored.mode !== 'unset') {
    return stored;
  }

  // Older builds only persisted Mecca city/country defaults.
  if (slice.prayerCity?.trim() && slice.prayerCountry?.trim()) {
    return {
      mode: 'city',
      city: slice.prayerCity,
      country: slice.prayerCountry,
      latitude: null,
      longitude: null,
      timezone: null,
      timezoneId: null,
      label: `${slice.prayerCity}, ${slice.prayerCountry}`,
    };
  }

  return stored ?? defaultPrayerLocation;
};

export const isPrayerLocationConfigured = (location: PrayerLocation): boolean => {
  if (location.mode === 'unset') {
    return false;
  }
  // Prefer coordinates (GPS / Places). City+country remains a legacy fallback.
  if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
    return true;
  }
  return Boolean(location.city?.trim() && location.country?.trim());
};
