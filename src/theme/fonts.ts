import type {Languages} from '@Types/languages';

export type FontSet = {
  regular: string | undefined;
  semiBold: string | undefined;
  bold: string | undefined;
};

/** Linked custom fonts in `src/assets/fonts/` (Inter + Cairo for UI). */
export const linkedFontFamilies: Record<Languages, FontSet> = {
  en: {
    regular: 'Inter-Regular',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  ar: {
    regular: 'Cairo-Regular',
    semiBold: 'Cairo-SemiBold',
    bold: 'Cairo-Bold',
  },
};

/**
 * Amiri Naskh — use for vocalized Arabic content (adhkar, hadith, etc.).
 * Cairo is a UI sans and mis-shapes heavy tashkeel (e.g. يًّا).
 * Kept even when UI language is English so platforms do not fall back to
 * Geeza/Noto with mismatched metrics.
 */
export const arabicScriptFonts: FontSet = {
  regular: 'Amiri-Regular',
  semiBold: 'Amiri-Regular',
  bold: 'Amiri-Bold',
};

/**
 * Amiri Quran — dedicated face for Uthmani mushaf text (waqf, hamza rules).
 */
export const mushafFonts: FontSet = {
  regular: 'AmiriQuran-Regular',
  semiBold: 'AmiriQuran-Regular',
  bold: 'AmiriQuran-Regular',
};

/** Uses bundled Inter (EN) and Cairo (AR) from `src/assets/fonts/`. */
export const getFontFamilies = (lang: Languages): FontSet => {
  return linkedFontFamilies[lang];
};
