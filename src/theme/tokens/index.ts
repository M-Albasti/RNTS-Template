import {getSemanticColors, type ColorScheme, type SemanticColors} from './colors';
import {radius, type RadiusToken} from './radius';
import {shadows, type ShadowToken} from './shadows';
import {spacing, type SpacingToken} from './spacing';
import {typography, type TypographyToken} from './typography';

/** Full design token set for one color scheme. Pass to `createThemedStyles` or `useThemeTokens`. */
export type ThemeTokens = {
  scheme: ColorScheme;
  colors: SemanticColors;
  spacing: SpacingToken;
  radius: RadiusToken;
  typography: TypographyToken;
  shadows: ShadowToken;
};

export const createThemeTokens = (scheme: ColorScheme): ThemeTokens => ({
  scheme,
  colors: getSemanticColors(scheme),
  spacing,
  radius,
  typography,
  shadows,
});

export {getSemanticColors, spacing, radius, typography, shadows};
export type {ColorScheme, SemanticColors} from './colors';
export type {SpacingToken} from './spacing';
export type {RadiusToken} from './radius';
export type {TypographyToken} from './typography';
export type {ShadowToken} from './shadows';
