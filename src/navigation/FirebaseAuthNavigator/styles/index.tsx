import {layout} from '@theme/tokens';

import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: layout.flex.fill,
  },
  fallback: {
    flex: layout.flex.fill,
  },
  fallbackText: {
    fontSize: 25,
  },
});
