import {getSemanticColors, type ColorScheme, type SemanticColors} from './colors';
import {layout, type LayoutToken} from './layout';
import {radius, type RadiusToken} from './radius';
import {getShadows, type ShadowToken} from './shadows';
import {spacing, type SpacingToken} from './spacing';
import {applyFontFamilies, typography, type TypographyToken} from './typography';
import {getFontFamilies} from '@theme/fonts';
import type {Languages} from '@Types/languages';

/** Full design token set for one color scheme. Pass to `createThemedStyles` or `useThemeTokens`. */
export type ThemeTokens = {
  scheme: ColorScheme;
  colors: SemanticColors;
  spacing: SpacingToken;
  radius: RadiusToken;
  typography: TypographyToken;
  shadows: ShadowToken;
  layout: LayoutToken;
};

export const createThemeTokens = (
  scheme: ColorScheme,
  lang: Languages = 'en',
): ThemeTokens => ({
  scheme,
  colors: getSemanticColors(scheme),
  spacing,
  radius,
  typography: applyFontFamilies(typography, getFontFamilies(lang)),
  shadows: getShadows(scheme),
  layout,
});

export {getSemanticColors, getShadows, spacing, radius, typography, layout};
export const shadows = getShadows('light');
export type {ColorScheme, SemanticColors} from './colors';
export type {SpacingToken} from './spacing';
export type {RadiusToken} from './radius';
export type {TypographyToken} from './typography';
export type {ShadowToken} from './shadows';
export type {LayoutToken} from './layout';
