import {TextStyle} from 'react-native';

import type {FontSet} from '@theme/fonts';
import type {TypographyToken} from '@theme/types';

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
    lineHeight: 40,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  title: {
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  input: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  subtitle: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  /** Uthmani mushaf body — taller line height for diacritics. */
  mushafBody: {
    fontSize: 26,
    lineHeight: 48,
    fontWeight: '500' as TextStyle['fontWeight'],
  },
  mushafBasmala: {
    fontSize: 22,
    lineHeight: 40,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  mushafMarker: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
};

const weightToFont = (
  fonts: FontSet,
  weight: TextStyle['fontWeight'],
): string | undefined => {
  const numeric = typeof weight === 'string' ? Number(weight) : weight;
  if (numeric && numeric >= 600) {
    return fonts.semiBold ?? fonts.bold ?? fonts.regular;
  }
  return fonts.regular;
};

export const applyFontFamilies = (
  base: TypographyToken,
  fonts: FontSet,
): TypographyToken => ({
  display: {
    ...base.display,
    fontFamily: fonts.bold ?? fonts.semiBold ?? fonts.regular,
  },
  h1: {
    ...base.h1,
    fontFamily: fonts.bold ?? fonts.semiBold ?? fonts.regular,
  },
  h2: {
    ...base.h2,
    fontFamily: weightToFont(fonts, base.h2.fontWeight),
  },
  h3: {
    ...base.h3,
    fontFamily: weightToFont(fonts, base.h3.fontWeight),
  },
  title: {
    ...base.title,
    fontFamily: fonts.bold ?? fonts.semiBold ?? fonts.regular,
  },
  input: {
    ...base.input,
    fontFamily: weightToFont(fonts, base.input.fontWeight),
  },
  subtitle: {
    ...base.subtitle,
    fontFamily: weightToFont(fonts, base.subtitle.fontWeight),
  },
  body: {
    ...base.body,
    fontFamily: fonts.regular,
  },
  bodySmall: {
    ...base.bodySmall,
    fontFamily: fonts.regular,
  },
  caption: {
    ...base.caption,
    fontFamily: fonts.regular,
  },
  button: {
    ...base.button,
    fontFamily: weightToFont(fonts, base.button.fontWeight),
  },
  mushafBody: {
    ...base.mushafBody,
    fontFamily: fonts.regular,
  },
  mushafBasmala: {
    ...base.mushafBasmala,
    fontFamily: weightToFont(fonts, base.mushafBasmala.fontWeight),
  },
  mushafMarker: {
    ...base.mushafMarker,
    fontFamily: fonts.bold ?? fonts.semiBold ?? fonts.regular,
  },
});
