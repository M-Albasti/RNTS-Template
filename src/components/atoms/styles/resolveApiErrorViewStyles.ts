import type {ThemeTokens} from '@theme/types';

export const resolveApiErrorViewStyles = (tokens: ThemeTokens) => ({
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
  card: {
    width: '100%' as const,
    maxWidth: 360,
    backgroundColor: tokens.colors.errorMuted,
    borderRadius: tokens.radius.lg,
    borderWidth: tokens.layout.borderWidth.hairline,
    borderColor: tokens.colors.error,
    padding: tokens.spacing.lg,
    alignItems: tokens.layout.alignItems.center,
  },
  iconCircle: {
    width: tokens.sizes.avatarMd,
    height: tokens.sizes.avatarMd,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.surface,
    justifyContent: tokens.layout.justifyContent.center,
    alignItems: tokens.layout.alignItems.center,
    marginBottom: tokens.spacing.md,
  },
  message: {
    marginBottom: tokens.spacing.lg,
  },
  action: {
    minWidth: 140,
  },
});
