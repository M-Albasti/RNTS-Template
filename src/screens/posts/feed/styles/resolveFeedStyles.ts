import type {ThemeTokens} from '@theme/types';

export const resolveFeedStyles = (tokens: ThemeTokens) => ({
      list: {flex: tokens.layout.flex.fill},
      footer: {paddingBottom: tokens.spacing.xxl},
      sortRow: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
    });
