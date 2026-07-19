/** Uthmani basmala as returned by Al Quran Cloud (ayah 1 of most surahs). */
export const QURAN_BASMALA = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

const BASMALA_PREFIX =
  /^بِسْمِ\s*ٱ?للَّهِ\s*ٱلرَّحْمَ[َٰ]نِ\s*ٱلرَّحِيمِ\s*/u;

export type MushafPageAyah = {
  number: number;
  numberInSurah: number;
  text: string;
  surahNumber: number;
  surahName: string;
  surahNameEn: string;
  juz: number;
  sajda: boolean;
};

export type MushafPageSegment = {
  surahNumber: number;
  surahName: string;
  /** True when this page begins (or continues into) ayah 1 of the surah. */
  showSurahBanner: boolean;
  /** True when ayah 1 includes a basmala that we render on its own line. */
  showBasmala: boolean;
  ayahs: Array<MushafPageAyah & {displayText: string}>;
};

/** Converts Western digits to Arabic-Indic (٠–٩) for mushaf markers. */
export const toArabicIndicDigits = (value: number | string): string =>
  String(value).replace(/\d/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)] ?? digit);

/** Strips a leading basmala so it can be shown on a dedicated line. */
export const stripLeadingBasmala = (text: string): {text: string; hadBasmala: boolean} => {
  const normalized = text.replace(/^\ufeff/, '');
  if (!BASMALA_PREFIX.test(normalized)) {
    return {text: normalized, hadBasmala: false};
  }
  return {text: normalized.replace(BASMALA_PREFIX, '').trim(), hadBasmala: true};
};

/**
 * Groups page ayahs by surah so we can insert Madinah-style surah banners
 * and a separate basmala line before ayah 1.
 */
export const buildMushafPageSegments = (ayahs: MushafPageAyah[]): MushafPageSegment[] => {
  const segments: MushafPageSegment[] = [];

  for (const ayah of ayahs) {
    const last = segments[segments.length - 1];
    const startsNewSurah = !last || last.surahNumber !== ayah.surahNumber;
    const {text: displayText, hadBasmala} =
      ayah.numberInSurah === 1
        ? stripLeadingBasmala(ayah.text)
        : {text: ayah.text.replace(/^\ufeff/, ''), hadBasmala: false};

    if (startsNewSurah) {
      segments.push({
        surahNumber: ayah.surahNumber,
        surahName: ayah.surahName,
        showSurahBanner: ayah.numberInSurah === 1,
        showBasmala: ayah.numberInSurah === 1 && hadBasmala,
        ayahs: [{...ayah, displayText}],
      });
      continue;
    }

    last.ayahs.push({...ayah, displayText});
  }

  return segments;
};

/** Unique surah names on the page for the mushaf header (RTL reading order). */
export const getPageSurahNames = (ayahs: MushafPageAyah[]): string => {
  const names: string[] = [];
  for (const ayah of ayahs) {
    if (!names.includes(ayah.surahName)) {
      names.push(ayah.surahName);
    }
  }
  return names.join(' ');
};
