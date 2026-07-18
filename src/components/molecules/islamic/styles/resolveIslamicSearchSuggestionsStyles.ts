import type {ThemeTokens} from '@theme/types';

export const resolveIslamicSearchSuggestionsStyles = (tokens: ThemeTokens) => ({
  section: {
    marginBottom: tokens.spacing.md,
  },
  sectionHeader: {
    ...tokens.layout.presets.rowBetween,
    alignItems: 'center' as const,
    marginBottom: tokens.spacing.sm,
  },
  chipWrap: {
    ...tokens.layout.presets.wrapRow,
    gap: tokens.spacing.xs,
  },
  chip: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    maxWidth: '100%' as const,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    gap: tokens.spacing.xxs,
  },
  chipPressed: {
    backgroundColor: tokens.colors.surfaceSecondary,
  },
  chipRecent: {
    borderColor: 'rgba(15, 61, 46, 0.28)',
    backgroundColor: 'rgba(15, 61, 46, 0.06)',
  },
  clearBtn: {
    paddingHorizontal: tokens.spacing.xs,
    paddingVertical: tokens.spacing.xxs,
  },
  removeBtn: {
    marginLeft: tokens.spacing.xxs,
    padding: tokens.spacing.xxs,
  },
});
