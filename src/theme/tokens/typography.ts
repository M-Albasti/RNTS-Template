import type {FontSet} from '@theme/fonts';
import {mushafFonts} from '@theme/fonts';
import type {TypographyToken} from '@theme/types';
import {TextStyle} from 'react-native';

type TypographyStyle = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight' | 'fontFamily'>;

/** Typography scale — font sizes and weights shared across Heading, TextView, Button. */
export const typography: Record<
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'input'
  | 'subtitle'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'button'
  | 'mushafBody'
  | 'mushafBasmala'
  | 'mushafMarker',
  TypographyStyle
> = {
  display: {
    fontSize: 32,
    lineHeight: 48,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  h1: {
    fontSize: 28,
    lineHeight: 42,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  h2: {
    fontSize: 22,
    lineHeight: 34,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  h3: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  title: {
    fontSize: 25,
    lineHeight: 38,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  subtitle: {
    fontSize: 19,
    lineHeight: 30,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  /** Uthmani mushaf body — taller line height for Amiri Quran diacritics. */
  mushafBody: {
    fontSize: 28,
    lineHeight: 56,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  mushafBasmala: {
    fontSize: 24,
    lineHeight: 44,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  mushafMarker: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
};

const weightToFont = (
  fonts: FontSet,
  weight: TextStyle['fontWeight'],
): string | undefined => {
  const numeric = typeof weight === 'string' ? Number(weight) : weight;
  if (numeric && numeric >= 700) {
    return fonts.bold ?? fonts.semiBold ?? fonts.regular;
  }
  if (numeric && numeric >= 500) {
    return fonts.semiBold ?? fonts.bold ?? fonts.regular;
  }
  return fonts.regular;
};

/**
 * Attach linked Inter/Cairo faces. Drop numeric `fontWeight` whenever a custom
 * `fontFamily` is set — Android synthesizes a different face when both are set,
 * so type ends up larger/heavier than iOS.
 */
const withLinkedFont = (
  style: TypographyStyle,
  fontFamily: string | undefined,
): TypographyStyle => {
  if (!fontFamily) {
    return style;
  }
  return {
    ...style,
    fontFamily,
    fontWeight: 'normal',
  };
};

export const applyFontFamilies = (
  base: TypographyToken,
  fonts: FontSet,
): TypographyToken => ({
  display: withLinkedFont(base.display, fonts.bold ?? fonts.semiBold ?? fonts.regular),
  h1: withLinkedFont(base.h1, fonts.bold ?? fonts.semiBold ?? fonts.regular),
  h2: withLinkedFont(base.h2, weightToFont(fonts, base.h2.fontWeight)),
  h3: withLinkedFont(base.h3, weightToFont(fonts, base.h3.fontWeight)),
  title: withLinkedFont(base.title, fonts.bold ?? fonts.semiBold ?? fonts.regular),
  input: withLinkedFont(base.input, weightToFont(fonts, base.input.fontWeight)),
  subtitle: withLinkedFont(base.subtitle, weightToFont(fonts, base.subtitle.fontWeight)),
  body: withLinkedFont(base.body, fonts.regular),
  bodySmall: withLinkedFont(base.bodySmall, fonts.regular),
  caption: withLinkedFont(base.caption, fonts.regular),
  button: withLinkedFont(base.button, weightToFont(fonts, base.button.fontWeight)),
  // Mushaf roles always use Amiri Quran so EN UI language does not swap in
  // Inter/Cairo (Cairo breaks Uthmani joining on heavy tashkeel).
  mushafBody: withLinkedFont(base.mushafBody, mushafFonts.regular),
  mushafBasmala: withLinkedFont(base.mushafBasmala, mushafFonts.regular),
  mushafMarker: withLinkedFont(base.mushafMarker, mushafFonts.regular),
});
