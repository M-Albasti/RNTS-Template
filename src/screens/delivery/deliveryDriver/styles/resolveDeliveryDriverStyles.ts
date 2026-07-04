import type {ThemeTokens} from '@theme/types';

export const resolveDeliveryDriverStyles = (tokens: ThemeTokens) => ({
    switchRow: {...tokens.layout.presets.rowBetween},
    jobCard: {marginBottom: tokens.spacing.sm, gap: tokens.spacing.xs},
  });
