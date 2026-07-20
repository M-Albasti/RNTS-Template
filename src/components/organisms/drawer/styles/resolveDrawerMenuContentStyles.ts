import type {ThemeTokens} from '@theme/types';

export const resolveDrawerMenuContentStyles = (tokens: ThemeTokens) => ({
  scroll: {
    flex: tokens.layout.flex.fill,
    backgroundColor: tokens.colors.background,
  },
  /** flexGrow (not flex) so the menu can scroll when items exceed the viewport. */
  scrollContent: {
    flexGrow: tokens.layout.flexGrow.fill,
    paddingTop: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
  header: {
    paddingHorizontal: tokens.spacing.sm,
    paddingBottom: tokens.spacing.md,
  },
  avatar: {
    width: tokens.sizes.touchTarget,
    height: tokens.sizes.touchTarget,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.primaryMuted,
    ...tokens.layout.presets.center,
    marginBottom: tokens.spacing.sm,
  },
  menuSection: {
    gap: tokens.spacing.xxs,
  },
  item: {
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    gap: tokens.spacing.sm,
    minHeight: tokens.sizes.touchTarget,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.lg,
  },
  itemActive: {
    backgroundColor: tokens.colors.primaryMuted,
  },
  itemPressed: {
    backgroundColor: tokens.colors.surfaceSecondary,
  },
  itemIcon: {
    width: tokens.sizes.avatarSm,
    height: tokens.sizes.avatarSm,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.surface,
    ...tokens.layout.presets.center,
  },
  itemIconActive: {
    backgroundColor: tokens.colors.primary,
  },
  itemLabel: {
    flex: tokens.layout.flex.fill,
  },
  itemLabelActive: {
    color: tokens.colors.primary,
  },
  footer: {
    marginTop: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    borderTopWidth: tokens.layout.borderWidth.sm,
    borderTopColor: tokens.colors.border,
    gap: tokens.spacing.xs,
  },
  logoutIcon: {
    backgroundColor: tokens.colors.errorMuted,
  },
  logoutLabel: {
    color: tokens.colors.error,
  },
});
