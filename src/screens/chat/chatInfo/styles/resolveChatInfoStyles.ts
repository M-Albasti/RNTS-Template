import type {ThemeTokens} from '@theme/types';

export const resolveChatInfoStyles = (tokens: ThemeTokens) => ({
    avatar: {
      width: tokens.sizes.avatarLg,
      height: tokens.sizes.avatarLg,
      borderRadius: tokens.radius.full,
      ...tokens.layout.presets.selfCenter,
    },
    row: {...tokens.layout.presets.rowBetween},
  });
