import {ViewStyle} from 'react-native';

import type {ColorScheme} from './colors';

type ShadowPreset = Pick<
  ViewStyle,
  | 'shadowColor'
  | 'shadowOffset'
  | 'shadowOpacity'
  | 'shadowRadius'
  | 'elevation'
>;

const createShadowPreset = (
  shadowColor: string,
  shadowOffset: {width: number; height: number},
  shadowOpacity: number,
  shadowRadius: number,
  elevation: number,
): ShadowPreset => ({
  shadowColor,
  shadowOffset,
  shadowOpacity,
  shadowRadius,
  elevation,
});

/** Elevation presets — use `shadow` on iOS and `elevation` on Android together. */
export const getShadows = (scheme: ColorScheme) =>
  ({
    none: createShadowPreset('transparent', {width: 0, height: 0}, 0, 0, 0),
    sm: createShadowPreset(
      scheme === 'dark' ? '#000000' : '#0F172A',
      {width: 0, height: 1},
      scheme === 'dark' ? 0.28 : 0.06,
      4,
      2,
    ),
    md: createShadowPreset(
      scheme === 'dark' ? '#000000' : '#0F172A',
      {width: 0, height: 3},
      scheme === 'dark' ? 0.32 : 0.08,
      8,
      4,
    ),
    lg: createShadowPreset(
      scheme === 'dark' ? '#000000' : '#0F172A',
      {width: 0, height: 6},
      scheme === 'dark' ? 0.38 : 0.1,
      14,
      8,
    ),
  }) as const;

export type ShadowToken = ReturnType<typeof getShadows>;

/** @deprecated Use `getShadows(scheme)` via theme tokens */
export const shadows = getShadows('light');
