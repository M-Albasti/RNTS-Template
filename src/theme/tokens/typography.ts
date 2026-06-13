import {TextStyle} from 'react-native';

import type {FontSet} from '@theme/fonts';

type TypographyStyle = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight' | 'fontFamily'>;

/** Typography scale — font sizes and weights shared across Heading, TextView, Button. */
export const typography: Record<
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'button',
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
};

export type TypographyToken = typeof typography;

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
});
