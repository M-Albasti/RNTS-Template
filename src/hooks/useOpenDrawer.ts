import {useCallback} from 'react';
import {DrawerActions, type NavigationProp, type ParamListBase} from '@react-navigation/native';

/**
 * Opens the root drawer from any nested screen (tabs / stacks).
 */
export const useOpenDrawer = (
  navigation: Pick<NavigationProp<ParamListBase>, 'dispatch'>,
) =>
  useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);
