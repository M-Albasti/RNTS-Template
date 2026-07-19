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
    alignSelf: 'stretch' as const,
    width: '100%' as const,
    maxWidth: 360,
    minHeight: tokens.sizes.touchTarget * 3,
    backgroundColor: tokens.colors.errorMuted,
    borderRadius: tokens.radius.lg,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.error,
    padding: tokens.spacing.lg,
    alignItems: tokens.layout.alignItems.center,
    gap: tokens.spacing.sm,
  },
  iconCircle: {
    width: tokens.sizes.avatarMd,
    height: tokens.sizes.avatarMd,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.surface,
    justifyContent: tokens.layout.justifyContent.center,
    alignItems: tokens.layout.alignItems.center,
  },
  title: {
    alignSelf: 'stretch' as const,
  },
  message: {
    alignSelf: 'stretch' as const,
    marginBottom: tokens.spacing.xs,
  },
  action: {
    minWidth: 140,
    marginTop: tokens.spacing.xs,
  },
});
