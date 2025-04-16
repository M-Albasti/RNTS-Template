//* packages import
import type {LinkingOptions} from '@react-navigation/native';

//* config import
import {linkingConfig} from '@config/linkingConfig';

export const linking: LinkingOptions<any> = {
  enabled: true,
  prefixes: [
    /* your linking prefixes */
    'projectdeeplink://',
    'https://projectdeeplink.com',
    'https://*.projectdeeplink.com',
  ],
  config: linkingConfig,
};
