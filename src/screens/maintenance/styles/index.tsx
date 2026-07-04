import {StyleSheet} from 'react-native';

import {layout, spacing} from '@theme/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: layout.flex.fill,
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
