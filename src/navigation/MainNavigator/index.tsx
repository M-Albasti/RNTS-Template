//* packages import
import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {isEmpty} from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//* navigators import
import DrawerNavigator from '@navigation/DrawerNavigator';
import AuthNavigator from '@navigation/AuthNavigator';

//* screens import
import Settings from '@screens/settings';
import NotFound from '@screens/notFound';

//* components import
import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

//* hooks import
import {useAppSelector} from '@hooks/useAppSelector';

//* types import
import {RootStackParamList} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

const MainStack = createNativeStackNavigator<RootStackParamList>();

const MainNavigator = (): React.JSX.Element => {
  const user = useAppSelector(state => state.auth.user);
  const insets = useSafeAreaInsets();
  const isAuthenticated = !isEmpty(user);

  // React Navigation requires stable screen names — do NOT swap `name` dynamically.
  // Render AuthStack OR DrawerRoot based on auth state; both stay registered in the type map.
  return (
    <MainStack.Navigator
      layout={({children}) => (
        <ErrorBoundary>
          <Suspense
            fallback={
              <TextView
                text={'Loading...'}
                style={styles.fallbackText}
                containerStyle={styles.fallback}
              />
            }>
            <View
              style={[
                styles.container,
                {
                  // paddingTop: insets.top,
                  paddingBottom: insets.bottom,
                  paddingLeft: insets.left,
                  paddingRight: insets.right,
                },
              ]}>
              {children}
            </View>
          </Suspense>
        </ErrorBoundary>
      )}
      screenOptions={{headerShown: false}}>
      <MainStack.Group>
        {isAuthenticated ? (
          <MainStack.Screen name="DrawerRoot" component={DrawerNavigator} />
        ) : (
          <MainStack.Screen name="AuthStack" component={AuthNavigator} />
        )}
        <MainStack.Screen name="NotFound" component={NotFound} />
      </MainStack.Group>
      <MainStack.Group screenOptions={{presentation: 'modal'}}>
        <MainStack.Screen name="Settings" component={Settings} />
      </MainStack.Group>
    </MainStack.Navigator>
  );
};

export default MainNavigator;
