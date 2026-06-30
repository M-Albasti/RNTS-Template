import type {ThemeTokens} from '@theme/types';

export const resolveMerchantOrdersStyles = (tokens: ThemeTokens) => ({
    card: {marginBottom: tokens.spacing.sm, gap: tokens.sizes.progressTrack},
  });
