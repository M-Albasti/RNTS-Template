import {CommonActions} from '@react-navigation/native';

import {navigationRef} from '@services/navigationServices/NavigationService';

type IslamicWidgetScreen =
  | 'QuranReader'
  | 'PrayerTimes'
  | 'PrayerLocationSetup'
  | 'IslamicHub';

/** Navigate into Islamic stack screens from widget / deep-link hosts. */
export const navigateIslamic = (
  screen: IslamicWidgetScreen,
  params?: Record<string, unknown>,
): void => {
  const tryNavigate = () => {
    if (!navigationRef.isReady()) {
      return false;
    }
    navigationRef.dispatch(
      CommonActions.navigate({
        name: 'DrawerRoot',
        params: {
          screen: 'IslamicStack',
          params: {
            screen,
            params,
          },
        },
      }),
    );
    return true;
  };

  if (tryNavigate()) {
    return;
  }

  // Navigation may still be booting when a cold-start widget deep link arrives.
  setTimeout(() => {
    tryNavigate();
  }, 500);
};

export const openQuranMushaf = (surahNumber: number, ayahNumber = 1): void => {
  const surah = Math.min(114, Math.max(1, Math.floor(surahNumber) || 1));
  const ayah = Math.max(1, Math.floor(ayahNumber) || 1);
  navigateIslamic('QuranReader', {surahNumber: surah, ayahNumber: ayah});
};

export const openPrayerTimes = (): void => {
  navigateIslamic('PrayerTimes');
};
