export type AdhkarLanguage = 'ar' | 'en';

export type AdhkarCategory = {
  id: number;
  title: string;
  audioUrl?: string;
  contentUrl: string;
};

export type AdhkarItem = {
  id: number;
  arabicText: string;
  translatedText: string;
  description?: string;
  repeat: number;
  audioUrl?: string;
};

/** Full-text adhkar match (dhikr body or category title). */
export type AdhkarSearchMatch = {
  itemId: number;
  categoryId: number;
  categoryTitle: string;
  arabicText: string;
  translatedText: string;
  repeat: number;
  /** True when only the category title matched (no specific dhikr body). */
  isCategoryMatch?: boolean;
};

export type QuranSurahSummary = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
};

export type QuranAyah = {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
  juz: number;
  page: number;
  sajda: boolean;
  tafsir?: string;
  translation?: string;
};

export type QuranJuzSummary = {
  number: number;
  firstAyahRef: string;
  firstSurahName: string;
  ayahCount: number;
};

export type QuranSearchMode = 'surah' | 'ayah' | 'text';

export type QuranPreferences = {
  reciterId: string;
  tafsirEditionId: string;
  showTafsir: boolean;
  showTranslation: boolean;
};

/** Preferred adhkar voice — Hisn sequential or continuous session reciters. */
export type AdhkarPreferences = {
  reciterId: string;
};

export type QuranLastRead = {
  surahNumber: number;
  ayahNumber: number;
};

export type QuranSurahDetail = QuranSurahSummary & {
  ayahs: QuranAyah[];
};

export type QuranSearchMatch = {
  number: number;
  text: string;
  numberInSurah: number;
  surah: QuranSurahSummary;
  edition: {
    identifier: string;
    language: string;
    name: string;
  };
};

export type HadithEdition = {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  hadithCount: number;
  bookCount: number;
  availableLanguages: string[];
  category: 'sahih' | 'sunan' | 'special';
};

export type HadithLastRead = {
  hadithId: string;
  editionSlug: string;
  editionName: string;
  hadithIndex: number;
};

export type HadithBook = {
  id: string;
  name: string;
  bookIndex: number;
  hadithCount: number;
};

export type HadithGrade = {
  name: string;
  grade: string;
};

export type HadithSummary = {
  id: string;
  editionSlug: string;
  editionName: string;
  bookName?: string;
  hadithIndex: number;
  /** Preferred preview text for the active UI language. */
  text: string;
  arabicText?: string;
  englishText?: string;
  grades: HadithGrade[];
  /** Scholar notes / explanation when the API provides one. */
  tafsir?: string;
};

export type HadithDetail = HadithSummary & {
  bookIndex?: number;
  bookHadithIndex?: number;
};

/** Ordered prayer / solar times shown in the prayer schedule UI. */
export type PrayerTimeKey =
  | 'fajr'
  | 'sunrise'
  | 'duha'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha'
  | 'midnight';

export type PrayerTimings = {
  fajr: string;
  sunrise: string;
  duha: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  midnight: string;
  date: string;
  hijriDate: string;
  /** Hijri month in Arabic when available from Aladhan. */
  hijriDateAr?: string;
};

/** Per-prayer local reminder toggles (Notifee). */
export type PrayerReminderKey = PrayerTimeKey;

export type PrayerReminderSettings = {
  /** When true, all prayer keys are treated as enabled. */
  enabledAll: boolean;
  byKey: Partial<Record<PrayerReminderKey, boolean>>;
};

/** How the user chose prayer-location source. */
export type PrayerLocationMode = 'gps' | 'city' | 'timezone' | 'unset';

export type PrayerLocation = {
  mode: PrayerLocationMode;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  timezoneId: string | null;
  label: string;
};

export type IslamicNotificationKind =
  | 'morning_adhkar'
  | 'evening_adhkar'
  | 'quran_ayah'
  | 'hadith'
  | 'general_dhikr';

export type IslamicNotificationSettings = {
  enabled: boolean;
  hourlyReminders: boolean;
  includeQuran: boolean;
  includeHadith: boolean;
  includeAdhkar: boolean;
};

export type IslamicNotificationPayload = {
  kind: IslamicNotificationKind;
  title: string;
  body: string;
  reference?: string;
};
