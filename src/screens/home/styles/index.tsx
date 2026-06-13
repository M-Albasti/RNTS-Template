import {layout} from '@theme/tokens';

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: layout.flex.fill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {},
  slide1: {
    flex: layout.flex.fill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: layout.flex.fill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: layout.flex.fill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
});
