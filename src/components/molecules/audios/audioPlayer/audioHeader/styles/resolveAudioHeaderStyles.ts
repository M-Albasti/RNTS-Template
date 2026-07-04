import {ScreenHeight} from '@rneui/base';

import type {ThemeTokens} from '@theme/types';

export const resolveAudioHeaderStyles = (tokens: ThemeTokens) => ({
  mainbar: {
    height: ScreenHeight * 0.1,
    width: '100%' as const,
    ...tokens.layout.presets.rowBetween,
    paddingHorizontal: '10%',
  },
  nowPlayingText: {
    ...tokens.typography.subtitle,
    textAlign: tokens.layout.textAlign.center,
    color: tokens.colors.textPrimary,
  },
});
