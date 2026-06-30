import type {ThemeTokens} from '@theme/types';

export const resolveSpacerStyles = (tokens: ThemeTokens) => ({
  vNone: {height: tokens.spacing.none},
  vXxs: {height: tokens.spacing.xxs},
  vXs: {height: tokens.spacing.xs},
  vSm: {height: tokens.spacing.sm},
  vMd: {height: tokens.spacing.md},
  vLg: {height: tokens.spacing.lg},
  vXl: {height: tokens.spacing.xl},
  vXxl: {height: tokens.spacing.xxl},
  vXxxl: {height: tokens.spacing.xxxl},
  hNone: {width: tokens.spacing.none},
  hXxs: {width: tokens.spacing.xxs},
  hXs: {width: tokens.spacing.xs},
  hSm: {width: tokens.spacing.sm},
  hMd: {width: tokens.spacing.md},
  hLg: {width: tokens.spacing.lg},
  hXl: {width: tokens.spacing.xl},
  hXxl: {width: tokens.spacing.xxl},
  hXxxl: {width: tokens.spacing.xxxl},
});
