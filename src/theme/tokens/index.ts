import {getSemanticColors} from './colors';
import {appPalette} from './colors.palette';
import {layout} from './layout';
import {radius} from './radius';
import {rating} from './rating';
import {sizes} from './sizes';
import {getShadows} from './shadows';
import {spacing} from './spacing';
import {applyFontFamilies, typography} from './typography';
import {getFontFamilies} from '@theme/fonts';
import type {ColorScheme, ThemeTokens} from '@theme/types';
import type {Languages} from '@Types/languages';

export const createThemeTokens = (
  scheme: ColorScheme,
  lang: Languages = 'en',
): ThemeTokens => ({
  scheme,
  colors: getSemanticColors(scheme),
  palette: appPalette,
  spacing,
  radius,
  sizes,
  typography: applyFontFamilies(typography, getFontFamilies(lang)),
  shadows: getShadows(scheme),
  layout,
  rating,
});

export {getSemanticColors, lightColors, darkColors} from './colors';
export {appPalette} from './colors.palette';
export {getShadows, spacing, radius, sizes, typography, layout, rating};
export const shadows = getShadows('light');

export type {
  ColorScheme,
  SemanticColors,
  AppPalette,
  TextAlign,
  SpacingToken,
  RadiusToken,
  SizeToken,
  TypographyToken,
  ShadowPreset,
  ShadowToken,
  LayoutToken,
  RatingToken,
  ThemeTokens,
} from '@theme/types';
