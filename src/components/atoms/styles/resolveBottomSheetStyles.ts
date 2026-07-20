import type {ThemeTokens} from '@theme/types';

export const resolveBottomSheetStyles = (tokens: ThemeTokens) => ({
  root: {
    flex: tokens.layout.flex.fill,
    justifyContent: 'flex-end' as const,
  },
  backdrop: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: tokens.colors.scrim,
  },
  backdropPress: {
    flex: tokens.layout.flex.fill,
  },
  sheet: {
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
    maxHeight: '85%' as const,
    ...tokens.shadows.md,
  },
  handle: {
    alignSelf: 'center' as const,
    width: 40,
    height: 4,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.border,
    marginBottom: tokens.spacing.md,
  },
  header: {
    gap: tokens.spacing.xxs,
    marginBottom: tokens.spacing.md,
  },
  body: {
    gap: tokens.spacing.xs,
  },
  footer: {
    marginTop: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    borderTopWidth: tokens.layout.borderWidth.sm,
    borderTopColor: tokens.colors.border,
  },
});
