import {layout} from '@theme/tokens';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: layout.flex.fill,
  },
  fallback: {
    flex: layout.flex.fill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 25,
  },
});
