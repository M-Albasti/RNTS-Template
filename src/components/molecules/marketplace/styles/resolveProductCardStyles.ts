import type {ThemeTokens} from '@theme/types';

export const resolveProductCardStyles = (tokens: ThemeTokens, buyable: boolean) => ({
  card: {
    width: '48%' as const,
    minWidth: tokens.sizes.minCardWidth,
    gap: tokens.spacing.xs,
    opacity: buyable ? 1 : 0.65,
  },
  emoji: {
    ...tokens.typography.display,
    textAlign: tokens.layout.textAlign.center,
    marginBottom: tokens.spacing.xs,
  },
  row: {...tokens.layout.presets.rowBetween, alignItems: tokens.layout.alignItems.center},
  addBtn: {
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.full,
    width: tokens.sizes.addButton,
    height: tokens.sizes.addButton,
    ...tokens.layout.presets.center,
  },
  addText: {
    color: tokens.colors.textInverse,
    ...tokens.typography.h3,
  },
});
