import {layout} from '@theme/tokens';

import type {ThemeTokens} from '@theme/types';

export const resolveRecordAudioViewStyles = (tokens: ThemeTokens) => ({
  container: {
    flex: layout.flex.fill,
    backgroundColor: tokens.colors.background,
  },
});
