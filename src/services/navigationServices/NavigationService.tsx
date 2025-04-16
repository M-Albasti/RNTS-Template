//* packages import
import {createNavigationContainerRef} from '@react-navigation/native';

//* types import
import {RootStackParamList} from '@Types/appNavigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const goBack = () => {
  return navigationRef?.goBack();
};

export const navigate = <ScreenName extends keyof RootStackParamList>(
  name: ScreenName,
  params: RootStackParamList[ScreenName],
) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate<any>(name, params);
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
