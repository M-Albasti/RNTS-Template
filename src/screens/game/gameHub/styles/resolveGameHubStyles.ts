import type {ThemeTokens} from '@theme/types';

export const resolveGameHubStyles = (tokens: ThemeTokens) => ({
  hero: {
    ...tokens.layout.presets.columnCenter,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.xl,
    ...tokens.shadows.md,
    borderBottomWidth: 4,
    borderBottomColor: tokens.colors.accent2,
  },
  heroText: {color: tokens.colors.textInverse},
  grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  stats: {...tokens.layout.presets.rowBetween, width: '100%'},
});
