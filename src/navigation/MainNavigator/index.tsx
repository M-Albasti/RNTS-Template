//* packages import
import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {isEmpty} from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//* navigators import
import DrawerNavigator from '../DrawerNavigator';
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

const MainNavigator = (props: any): React.JSX.Element => {
  const user = useAppSelector(state => state.auth.user);
  const insets = useSafeAreaInsets();
  console.log('User: =>', user, isEmpty(user));

  return (
    <MainStack.Navigator
      layout={({children, state, descriptors, navigation}) => (
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
        <MainStack.Screen
          name={isEmpty(user) ? 'AuthStack' : 'DrawerRoot'}
          component={isEmpty(user) ? AuthNavigator : DrawerNavigator}
        />
        <MainStack.Screen name="NotFound">
          {props => <NotFound {...props} />}
        </MainStack.Screen>
      </MainStack.Group>
      <MainStack.Group screenOptions={{presentation: 'modal'}}>
        <MainStack.Screen name="Settings">
          {props => <Settings {...props} />}
        </MainStack.Screen>
      </MainStack.Group>
    </MainStack.Navigator>
  );
};

export default MainNavigator;
