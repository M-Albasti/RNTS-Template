import {StyleSheet} from 'react-native';

import type {ThemeTokens} from '@theme/types';

export const resolveVideoContainerStyles = (tokens: ThemeTokens) => ({
  loader: {
    ...StyleSheet.absoluteFill,
    backgroundColor: tokens.colors.overlay,
  },
});
