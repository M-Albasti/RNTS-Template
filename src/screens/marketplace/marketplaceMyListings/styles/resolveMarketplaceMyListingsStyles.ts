import type {ThemeTokens} from '@theme/types';

export const resolveMarketplaceMyListingsStyles = (tokens: ThemeTokens) => ({
    listingCard: {
      marginBottom: tokens.spacing.sm,
      gap: tokens.sizes.progressTrack,
    },
  });
