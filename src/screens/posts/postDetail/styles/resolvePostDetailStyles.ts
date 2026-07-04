import type {ThemeTokens} from '@theme/types';

export const resolvePostDetailStyles = (tokens: ThemeTokens) => ({
    avatar: {
      width: tokens.sizes.avatarMd,
      height: tokens.sizes.avatarMd,
      borderRadius: tokens.radius.full,
    },
    header: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
    media: {
      width: '100%',
      height: tokens.sizes.postMediaHeight,
      borderRadius: tokens.radius.md,
    },
    comment: {gap: tokens.spacing.xs},
    actions: {gap: tokens.spacing.sm},
  });
