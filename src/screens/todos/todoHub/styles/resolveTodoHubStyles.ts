import type {ThemeTokens} from '@theme/types';

export const resolveTodoHubStyles = (tokens: ThemeTokens) => ({
      hero: {
        ...tokens.layout.presets.columnCenter,
        backgroundColor: tokens.colors.primaryMuted,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
      },
      grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
      stats: {...tokens.layout.presets.rowBetween, width: '100%'},
    });
