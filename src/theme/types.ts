import type {TextStyle, ViewStyle} from 'react-native';

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
