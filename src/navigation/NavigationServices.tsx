import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const goBack = () => {
  return navigationRef?.goBack();
};

export const navigate = (name: string, params?: Record<string, any>) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

const push = (routeName: string, params?: Record<string, any>) => {
  throw new Error('Missing implementation of push');
};

const reset = (routeName: string) => {
  throw new Error('Missing implementation of reset');
};

const getCurrentRoute = () => {
  throw new Error('Missing implementation of getCurrentRoute');
};

const getRouteName = (): string | undefined => {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name ?? '';
  }
};

const NavigationService = {
  navigate,
  push,
  goBack,
  reset,
  getCurrentRoute,
  getRouteName,
};

export default NavigationService;
