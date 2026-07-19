import type {ViewStyle} from 'react-native';

import {
  alignContent,
  alignItems,
  alignSelf,
  borderWidth,
  flex,
  flexDirection,
  flexGrow,
  flexShrink,
  flexWrap,
  overflow,
  position,
  presets,
  textAlign as layoutTextAlign,
  justifyContent,
  zIndex,
} from './tokens/layout';
import {radius} from './tokens/radius';
import {rating} from './tokens/rating';
import {sizes} from './tokens/sizes';
import {spacing} from './tokens/spacing';
import {typography} from './tokens/typography';
import {appPalette} from './tokens/colors.palette';

/** App color scheme — light, dark, or follow system via settings. */
export type ColorScheme = 'light' | 'dark';

/**
 * Semantic color tokens — map brand palette to roles (background, surface, text, etc.).
 * Components should use `tokens.colors.textPrimary`, not raw hex from `@constants/colors`.
 */
export type SemanticColors = {
  background: string;
  surface: string;
  surfaceSecondary: string;
  primary: string;
  primaryMuted: string;
  primaryContrast: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderStrong: string;
  success: string;
  successMuted: string;
  error: string;
  errorMuted: string;
  warning: string;
  warningMuted: string;
  ratingStar: string;
  ratingStarEmpty: string;
  overlay: string;
  transparent: string;
  scrim: string;
  mediaOverlay: string;
  cameraBackground: string;
  cameraControlSurface: string;
  cameraControlActive: string;
  cameraShutterBorder: string;
  cameraShutterFill: string;
  cameraForeground: string;
  mapRoute: string;
  liveBadge: string;
  onLiveBadge: string;
  /** Accent slides / highlights (home carousel) */
  accent1: string;
  accent2: string;
  accent3: string;
  /**
   * Bright accents for interactive selection (e.g. word-puzzle drag path).
   * Prefer these over hard-coded hex in components.
   */
  selectionAccents: readonly string[];
  /** Madinah-style mushaf page surface (parchment). */
  mushafPage: string;
  /** Outer ornamental frame. */
  mushafBorderOuter: string;
  /** Inner frame / divider lines. */
  mushafBorder: string;
  /** Surah title banner fill. */
  mushafBanner: string;
  /** Body ink for Uthmani text. */
  mushafInk: string;
  /** Juz / surah meta labels. */
  mushafMeta: string;
  /** Soft blue follow-along ayah highlight. */
  mushafHighlight: string;
  /** Gold/bronze ornaments (corners, markers). */
  mushafOrnament: string;
  /** Hadith library chrome (teal header / reference bars). */
  hadithChrome: string;
  /** Slightly lighter chrome for meta sub-headers. */
  hadithChromeMuted: string;
  /** Text/icons on hadith chrome. */
  hadithOnChrome: string;
  /** Dark immersive hadith reading surface. */
  hadithReaderBg: string;
  /** Large body text on the hadith reader. */
  hadithReaderInk: string;
  /** Gold accent for quick-action icons on the hadith hub. */
  hadithAccent: string;
  /** Prayer times sky / hero surface. */
  prayerHero: string;
  /** Secondary wash on the prayer hero (sun path / night). */
  prayerHeroMuted: string;
  /** Accent for countdown pills and active prayer cards. */
  prayerAccent: string;
  /** Text/icons on prayer hero. */
  prayerOnHero: string;
  /** Soft fill for the active prayer row. */
  prayerActiveMuted: string;
};

export type AppPalette = typeof appPalette;

export type TextAlign = 'left' | 'center' | 'right';

export type SpacingToken = typeof spacing;

export type RadiusToken = typeof radius;

export type SizeToken = typeof sizes;

export type RatingToken = typeof rating;

export type TypographyToken = typeof typography;

export type ShadowPreset = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

export type ShadowToken = {
  none: ShadowPreset;
  sm: ShadowPreset;
  md: ShadowPreset;
  lg: ShadowPreset;
};

export type LayoutToken = {
  flex: typeof flex;
  flexGrow: typeof flexGrow;
  flexShrink: typeof flexShrink;
  borderWidth: typeof borderWidth;
  justifyContent: typeof justifyContent;
  alignItems: typeof alignItems;
  alignSelf: typeof alignSelf;
  alignContent: typeof alignContent;
  textAlign: typeof layoutTextAlign;
  flexDirection: typeof flexDirection;
  flexWrap: typeof flexWrap;
  position: typeof position;
  overflow: typeof overflow;
  zIndex: typeof zIndex;
  presets: typeof presets;
};

/** Full design token set for one color scheme. Pass to `createThemedStyles` or `useThemeTokens`. */
export type ThemeTokens = {
  scheme: ColorScheme;
  colors: SemanticColors;
  palette: AppPalette;
  spacing: SpacingToken;
  radius: RadiusToken;
  sizes: SizeToken;
  typography: TypographyToken;
  shadows: ShadowToken;
  layout: LayoutToken;
  rating: RatingToken;
};
