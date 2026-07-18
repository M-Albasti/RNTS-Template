import type {
  AyahDto,
  HadislamBookDto,
  HadislamEditionDto,
  HadislamHadithDto,
  HisnCategoryDto,
  HisnItemDto,
  PrayerTimingsResponseDto,
  SurahDetailDto,
  SurahSummaryDto,
} from '@api/server/islamic.dto';
import {getHadithEditionNameAr} from '@constants/hadithEditionNames';
import type {
  AdhkarCategory,
  AdhkarItem,
  HadithBook,
  HadithDetail,
  HadithEdition,
  HadithSummary,
  PrayerTimings,
  QuranAyah,
  QuranSearchMatch,
  QuranSurahDetail,
  QuranSurahSummary,
} from '@Types/islamicTypes';

const SAHIH_SLUGS = new Set([
  'sahih-al-bukhari',
  'sahih-muslim',
  'forty-hadith-of-an-nawawi',
  'forty-hadith-qudsi',
  'forty-hadith-of-shah-waliullah-dehlawi',
]);

const SUNAN_SLUGS = new Set([
  'sunan-abu-dawud',
  'sunan-al-tirmidhi',
  'sunan-an-nasai',
  'sunan-ibn-majah',
  'muwatta-imam-malik',
]);

export const mapSurahSummary = (dto: SurahSummaryDto): QuranSurahSummary => ({
  number: dto.number,
  name: dto.name,
  englishName: dto.englishName,
  englishNameTranslation: dto.englishNameTranslation,
  revelationType: dto.revelationType,
  // Search matches omit ayah counts — default so UI never sees undefined.
  numberOfAyahs: dto.numberOfAyahs ?? 0,
});

export const mapAyah = (dto: AyahDto): QuranAyah => ({
  number: dto.number,
  numberInSurah: dto.numberInSurah,
  text: dto.text.replace(/^\ufeff/, ''),
  audio: dto.audio,
  juz: dto.juz,
  page: dto.page,
  sajda: typeof dto.sajda === 'boolean' ? dto.sajda : Boolean(dto.sajda?.obligatory),
});

export const mapSurahDetail = (dto: SurahDetailDto): QuranSurahDetail => ({
  ...mapSurahSummary(dto),
  ayahs: dto.ayahs.map(mapAyah),
});

export const mapQuranSearchMatch = (
  match: {
    number: number;
    text: string;
    numberInSurah: number;
    surah: SurahSummaryDto;
    edition: {identifier: string; language: string; name: string};
  },
): QuranSearchMatch => ({
  number: match.number,
  text: match.text,
  numberInSurah: match.numberInSurah,
  surah: mapSurahSummary(match.surah),
  edition: match.edition,
});

const toHttpsUrl = (url?: string): string | undefined =>
  url ? url.replace(/^http:\/\//i, 'https://') : undefined;

export const mapHisnCategory = (
  dto: HisnCategoryDto,
  lang: 'ar' | 'en',
): AdhkarCategory => ({
  id: dto.ID,
  title: dto.TITLE,
  audioUrl: toHttpsUrl(dto.AUDIO_URL),
  contentUrl: dto.TEXT || `https://www.hisnmuslim.com/api/${lang}/${dto.ID}.json`,
});

export const mapHisnItem = (dto: HisnItemDto): AdhkarItem => ({
  id: dto.ID,
  arabicText: dto.ARABIC_TEXT,
  translatedText: dto.TRANSLATED_TEXT || dto.LANGUAGE_ARABIC_TRANSLATED_TEXT || '',
  repeat: dto.REPEAT,
  audioUrl: toHttpsUrl(dto.AUDIO),
});

const classifyEdition = (slug: string): HadithEdition['category'] => {
  if (SAHIH_SLUGS.has(slug)) {
    return 'sahih';
  }
  if (SUNAN_SLUGS.has(slug)) {
    return 'sunan';
  }
  return 'special';
};

export const mapHadithEdition = (dto: HadislamEditionDto): HadithEdition => ({
  id: dto._id,
  slug: dto.slug,
  name: dto.name.en,
  nameAr: dto.name.ar || getHadithEditionNameAr(dto.slug),
  hadithCount: dto.hadithCount,
  bookCount: dto.bookCount,
  availableLanguages: dto.availableLanguages,
  category: classifyEdition(dto.slug),
});

export const mapHadithBook = (dto: HadislamBookDto): HadithBook => ({
  id: dto._id,
  name: dto.name.en,
  bookIndex: dto.bookIndex,
  hadithCount: dto.hadithCount,
});

/** Prefer requested language, then any non-empty translation key from the API. */
const pickHadithText = (
  text: Record<string, string> | undefined,
  language = 'en',
): string => {
  if (!text) {
    return '';
  }
  const ordered = [
    text[language],
    text.en,
    text.ar,
    text['ar-diacritics'],
    ...Object.values(text),
  ];
  return ordered.find(value => typeof value === 'string' && value.trim().length > 0)?.trim() ?? '';
};

const pickArabicText = (text: Record<string, string> | undefined): string => {
  if (!text) {
    return '';
  }
  return (
    [text['ar-diacritics'], text.ar]
      .find(value => typeof value === 'string' && value.trim().length > 0)
      ?.trim() ?? ''
  );
};

const pickEnglishText = (text: Record<string, string> | undefined): string =>
  typeof text?.en === 'string' && text.en.trim() ? text.en.trim() : '';

const pickLocalizedField = (
  value: string | Record<string, string> | undefined,
  language = 'en',
): string | undefined => {
  if (!value) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value.trim() || undefined;
  }
  return pickHadithText(value, language) || undefined;
};

export const hasHadithText = (text: string | undefined): boolean =>
  Boolean(text && text.trim().length > 0);

export const mapHadithSummary = (
  dto: HadislamHadithDto,
  language = 'en',
): HadithSummary => {
  const arabicText = pickArabicText(dto.text) || undefined;
  const englishText = pickEnglishText(dto.text) || undefined;
  const text = pickHadithText(dto.text, language) || arabicText || englishText || '';
  const tafsir =
    pickLocalizedField(dto.tafsir, language) ||
    pickLocalizedField(dto.commentary, language) ||
    pickLocalizedField(dto.explanation, language);

  return {
    id: dto._id,
    editionSlug: dto.edition?.slug ?? '',
    editionName: dto.edition?.name.en ?? '',
    bookName: dto.book?.name.en,
    hadithIndex: dto.hadithIndex,
    text,
    arabicText,
    englishText,
    grades: dto.grades ?? [],
    tafsir,
  };
};

export const mapHadithDetail = (
  dto: HadislamHadithDto,
  language = 'en',
): HadithDetail => ({
  ...mapHadithSummary(dto, language),
  bookIndex: dto.bookIndex,
  bookHadithIndex: dto.bookHadithIndex,
});

/** Strip Aladhan timezone suffixes like " (EET)" from time strings. */
const cleanPrayerTime = (value: string | undefined): string => {
  if (!value) {
    return '--:--';
  }
  return value.replace(/\s*\(.*\)\s*$/, '').trim();
};

/**
 * Duha is not returned by Aladhan — start ≈ sunrise + max(15m, 1/4 of
 * the sunrise→dhuhr window), a common mobile-app convention.
 */
const computeDuhaTime = (sunriseRaw: string, dhuhrRaw: string): string => {
  const toMinutes = (raw: string): number | null => {
    const cleaned = cleanPrayerTime(raw);
    const match = cleaned.match(/^(\d{1,2}):(\d{2})/);
    if (!match) {
      return null;
    }
    return Number(match[1]) * 60 + Number(match[2]);
  };
  const sunrise = toMinutes(sunriseRaw);
  const dhuhr = toMinutes(dhuhrRaw);
  if (sunrise == null || dhuhr == null || dhuhr <= sunrise) {
    return cleanPrayerTime(sunriseRaw);
  }
  const offset = Math.max(15, Math.floor((dhuhr - sunrise) / 4));
  const total = sunrise + offset;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
};

export const mapPrayerTimings = (dto: PrayerTimingsResponseDto): PrayerTimings => {
  const fajr = cleanPrayerTime(dto.data.timings.Fajr);
  const sunrise = cleanPrayerTime(dto.data.timings.Sunrise);
  const dhuhr = cleanPrayerTime(dto.data.timings.Dhuhr);
  const asr = cleanPrayerTime(dto.data.timings.Asr);
  const maghrib = cleanPrayerTime(dto.data.timings.Maghrib);
  const isha = cleanPrayerTime(dto.data.timings.Isha);
  const midnight = cleanPrayerTime(dto.data.timings.Midnight);
  const hijri = dto.data.date.hijri;

  return {
    fajr,
    sunrise,
    duha: computeDuhaTime(sunrise, dhuhr),
    dhuhr,
    asr,
    maghrib,
    isha,
    midnight,
    date: dto.data.date.readable,
    hijriDate: `${hijri.day} ${hijri.month.en} ${hijri.year}`,
    hijriDateAr: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
  };
};

export const isWeakHadith = (grades: Array<{grade: string}>): boolean =>
  grades.some(g => /da[i'`]?f|mawdu|weak|very daif/i.test(g.grade));

export const isSahihHadith = (grades: Array<{grade: string}>): boolean =>
  grades.some(g => /sahih|hasan sahih|agreed upon/i.test(g.grade));
