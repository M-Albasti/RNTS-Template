import type {ThemeTokens} from '@theme/types';

export const resolveGameHubStyles = (tokens: ThemeTokens) => ({
      hero: {
        ...tokens.layout.presets.columnCenter,
        backgroundColor: tokens.colors.accent2,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
      },
      heroText: {color: tokens.colors.textInverse},
      grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
      stats: {...tokens.layout.presets.rowBetween, width: '100%'},
    });
