import type {ThemeTokens} from '@theme/types';

export const resolveEmptyViewStyles = (tokens: ThemeTokens) => ({
  container: {
    flex: tokens.layout.flex.fill,
    justifyContent: tokens.layout.justifyContent.center,
    alignItems: tokens.layout.alignItems.center,
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.xxl,
  },
  compact: {
    flexGrow: 0,
    flex: undefined,
    paddingVertical: tokens.spacing.xl,
  },
  iconCircle: {
    width: tokens.sizes.avatarLg,
    height: tokens.sizes.avatarLg,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.primaryMuted,
    justifyContent: tokens.layout.justifyContent.center,
    alignItems: tokens.layout.alignItems.center,
    marginBottom: tokens.spacing.md,
  },
  title: {
    marginBottom: tokens.spacing.xs,
  },
  message: {
    marginBottom: tokens.spacing.lg,
    maxWidth: 280,
  },
  action: {
    minWidth: 160,
  },
});
