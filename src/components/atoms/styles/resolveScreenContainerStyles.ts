import {StyleSheet} from 'react-native';

import type {ThemeTokens} from '@theme/types';
import {spacing} from '@theme/tokens';

type SpacingKey = keyof typeof spacing;

export const resolveScreenContainerStyles = (
  tokens: ThemeTokens,
  alignContent: 'center' | 'stretch',
  bottomPadding?: SpacingKey,
) => ({
  root: {
    flex: tokens.layout.flex.fill,
    backgroundColor: tokens.colors.background,
  },
  content: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
    alignItems: alignContent === 'center' ? ('center' as const) : ('stretch' as const),
    paddingBottom: bottomPadding
      ? tokens.spacing[bottomPadding]
      : tokens.spacing.lg,
  },
  contentCentered: {
    flexGrow: tokens.layout.flexGrow.fill,
    justifyContent: 'center' as const,
  },
});
