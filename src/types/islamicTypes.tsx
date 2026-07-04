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
  hadithCount: number;
  bookCount: number;
  availableLanguages: string[];
  category: 'sahih' | 'sunan' | 'special';
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
  text: string;
  grades: HadithGrade[];
};

export type HadithDetail = HadithSummary & {
  bookIndex?: number;
  bookHadithIndex?: number;
};

export type PrayerTimings = {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  hijriDate: string;
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
