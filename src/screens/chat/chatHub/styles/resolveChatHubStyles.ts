import type {ThemeTokens} from '@theme/types';

/** Hichat-inspired chat hub. */
export const resolveChatHubStyles = (tokens: ThemeTokens) => ({
  hero: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.lg,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    gap: tokens.spacing.sm,
  },
  stats: {
    ...tokens.layout.presets.row,
    gap: tokens.spacing.sm,
  },
  statChip: {
    flex: tokens.layout.flex.fill,
    backgroundColor: tokens.colors.primaryMuted,
    borderRadius: tokens.radius.lg,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.sm,
    alignItems: 'center' as const,
    gap: tokens.spacing.xxs,
  },
  grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
});
