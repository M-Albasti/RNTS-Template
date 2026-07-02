import type {ThemeTokens} from '@theme/types';

export const resolveCreatePollStyles = (tokens: ThemeTokens) => ({
      optionRow: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
      optionInput: {flex: tokens.layout.flex.fill},
    });
