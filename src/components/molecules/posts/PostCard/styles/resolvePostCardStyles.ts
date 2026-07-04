import type {ThemeTokens} from '@theme/types';

export const resolvePostCardStyles = (tokens: ThemeTokens) => ({
    header: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
    avatar: {
      width: tokens.sizes.avatarSm,
      height: tokens.sizes.avatarSm,
      borderRadius: tokens.radius.full,
    },
    meta: {flex: tokens.layout.flex.fill},
    media: {
      width: '100%',
      height: tokens.sizes.postMediaHeight,
      borderRadius: tokens.radius.md,
    },
    actions: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.md,
      flexWrap: tokens.layout.flexWrap.wrap,
    },
    actionRow: {...tokens.layout.presets.row, gap: tokens.spacing.xs},
    reactions: {...tokens.layout.presets.row, gap: tokens.spacing.xs},
    pollOption: {
      ...tokens.layout.presets.rowBetween,
      padding: tokens.spacing.sm,
      borderRadius: tokens.radius.sm,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      marginBottom: tokens.spacing.xs,
    },
    pollVoted: {borderColor: tokens.colors.primary, backgroundColor: tokens.colors.primaryMuted},
    tags: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.xs},
    tag: {
      backgroundColor: tokens.colors.surfaceSecondary,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      borderRadius: tokens.radius.sm,
    },
  });
