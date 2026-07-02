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
  numberOfAyahs: dto.numberOfAyahs,
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

export const mapHisnCategory = (
  dto: HisnCategoryDto,
  lang: 'ar' | 'en',
): AdhkarCategory => ({
  id: dto.ID,
  title: dto.TITLE,
  audioUrl: dto.AUDIO_URL,
  contentUrl: dto.TEXT || `https://www.hisnmuslim.com/api/${lang}/${dto.ID}.json`,
});

export const mapHisnItem = (dto: HisnItemDto): AdhkarItem => ({
  id: dto.ID,
  arabicText: dto.ARABIC_TEXT,
  translatedText: dto.TRANSLATED_TEXT || dto.LANGUAGE_ARABIC_TRANSLATED_TEXT || '',
  repeat: dto.REPEAT,
  audioUrl: dto.AUDIO,
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

const pickHadithText = (text: Record<string, string>, language = 'en'): string =>
  text[language] || text.en || text.ar || Object.values(text)[0] || '';

export const mapHadithSummary = (
  dto: HadislamHadithDto,
  language = 'en',
): HadithSummary => ({
  id: dto._id,
  editionSlug: dto.edition?.slug ?? '',
  editionName: dto.edition?.name.en ?? '',
  bookName: dto.book?.name.en,
  hadithIndex: dto.hadithIndex,
  text: pickHadithText(dto.text, language),
  grades: dto.grades ?? [],
});

export const mapHadithDetail = (
  dto: HadislamHadithDto,
  language = 'en',
): HadithDetail => ({
  ...mapHadithSummary(dto, language),
  bookIndex: dto.bookIndex,
  bookHadithIndex: dto.bookHadithIndex,
});

export const mapPrayerTimings = (dto: PrayerTimingsResponseDto): PrayerTimings => ({
  fajr: dto.data.timings.Fajr,
  sunrise: dto.data.timings.Sunrise,
  dhuhr: dto.data.timings.Dhuhr,
  asr: dto.data.timings.Asr,
  maghrib: dto.data.timings.Maghrib,
  isha: dto.data.timings.Isha,
  date: dto.data.date.readable,
  hijriDate: `${dto.data.date.hijri.day} ${dto.data.date.hijri.month.en} ${dto.data.date.hijri.year}`,
});

export const isWeakHadith = (grades: Array<{grade: string}>): boolean =>
  grades.some(g => /da[i'`]?f|mawdu|weak|very daif/i.test(g.grade));

export const isSahihHadith = (grades: Array<{grade: string}>): boolean =>
  grades.some(g => /sahih|hasan sahih|agreed upon/i.test(g.grade));
