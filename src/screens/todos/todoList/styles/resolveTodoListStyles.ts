import type {ThemeTokens} from '@theme/types';

export const resolveTodoListStyles = (tokens: ThemeTokens) => ({
      list: {flex: tokens.layout.flex.fill},
      row: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
      meta: {flex: tokens.layout.flex.fill, gap: tokens.spacing.xxs},
      done: {textDecorationLine: 'line-through' as const, opacity: 0.6},
      filters: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.xs},
      high: {color: tokens.colors.error},
      medium: {color: tokens.colors.warning},
    });
