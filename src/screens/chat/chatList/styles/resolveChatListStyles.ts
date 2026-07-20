import type {ThemeTokens} from '@theme/types';

/** Hichat-inspired thread list rows. */
export const resolveChatListStyles = (tokens: ThemeTokens) => ({
  list: {flex: tokens.layout.flex.fill},
  composerBar: {
    marginBottom: tokens.spacing.md,
  },
  thread: {
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    gap: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
  },
  row: {
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    gap: tokens.spacing.md,
  },
  avatar: {
    width: tokens.sizes.avatarMd,
    height: tokens.sizes.avatarMd,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.primaryMuted,
  },
  meta: {flex: tokens.layout.flex.fill, gap: 2},
  badge: {
    minWidth: 22,
    height: 22,
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
  threadCard: {
    borderRadius: tokens.radius.lg,
    overflow: 'hidden' as const,
  },
});
