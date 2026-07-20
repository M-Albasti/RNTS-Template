import type {ThemeTokens} from '@theme/types';

/**
 * Focusify auth chrome: large greeting, muted subtitle, roomy form stack.
 * Extra title padding avoids Cairo/Arabic top-clip.
 */
export const resolveAuthScreenShellStyles = (tokens: ThemeTokens) => ({
  root: {
    flex: tokens.layout.flex.fill,
    backgroundColor: tokens.colors.background,
  },
  header: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
    gap: tokens.spacing.sm,
  },
  title: {
    color: tokens.colors.textPrimary,
    paddingTop: tokens.spacing.md,
    lineHeight: 52,
  },
  subtitle: {
    color: tokens.colors.textMuted,
    lineHeight: 26,
    paddingTop: tokens.spacing.xxs,
  },
  body: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xxl,
    gap: tokens.spacing.lg,
    flexGrow: 1,
  },
  form: {
    gap: tokens.spacing.lg,
  },
  footer: {
    marginTop: 'auto' as const,
    paddingTop: tokens.spacing.xl,
    alignItems: 'center' as const,
    gap: tokens.spacing.sm,
  },
});
