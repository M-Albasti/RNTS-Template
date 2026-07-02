import {StyleSheet} from 'react-native';

import {layout} from '@theme/tokens';

export const styles = StyleSheet.create({
  container: {flex: layout.flex.fill},
  fallback: {flex: layout.flex.fill, justifyContent: 'center', alignItems: 'center'},
  fallbackText: {},
});
