import type {Languages} from '@Types/languages';

export type FontSet = {
  regular: string | undefined;
  semiBold: string | undefined;
  bold: string | undefined;
};

/** Linked custom fonts in `src/assets/fonts/` (Inter + Cairo). */
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

/** Uses bundled Inter (EN) and Cairo (AR) from `src/assets/fonts/`. */
export const getFontFamilies = (lang: Languages): FontSet => {
  return linkedFontFamilies[lang];
};
