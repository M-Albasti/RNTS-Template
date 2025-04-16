import {PathConfigMap} from '@react-navigation/native';

export type ConfigTypes = {
  initialRouteName?: string | number | symbol | undefined;
  screens: PathConfigMap<object>;
};
