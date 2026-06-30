import type {ThemeTokens} from '@theme/types';

export const resolveChatListStyles = (tokens: ThemeTokens) => ({
    list: {flex: tokens.layout.flex.fill},
    row: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
    avatar: {
      width: tokens.sizes.avatarMd,
      height: tokens.sizes.avatarMd,
      borderRadius: tokens.radius.full,
    },
    meta: {flex: tokens.layout.flex.fill},
    badge: {
      minWidth: tokens.sizes.iconSm,
      height: tokens.sizes.iconSm,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.primary,
      ...tokens.layout.presets.center,
      paddingHorizontal: tokens.spacing.xs,
    },
    badgeText: {
      ...tokens.typography.caption,
      color: tokens.colors.textInverse,
      ...tokens.layout.presets.textCenter,
    },
    mutedIcon: {opacity: 0.5},
  });
