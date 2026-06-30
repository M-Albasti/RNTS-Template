import type {DrawerNavigationProp} from '@react-navigation/drawer';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {DrawerParamList, RootStackParamList} from '@Types/appNavigation';

/** Props passed to stack navigator root components by React Navigation. */
export type StackNavigatorProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export type DrawerNavigatorProps = {
  navigation: DrawerNavigationProp<DrawerParamList>;
};

export type TabNavigatorProps = {
  navigation: BottomTabNavigationProp<RootStackParamList>;
};
