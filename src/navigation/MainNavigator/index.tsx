//* packages import
import React, {Suspense} from 'react';
import { View } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {isEmpty} from 'lodash';

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
            <View style={styles.container}>{children}</View>
          </Suspense>
        </ErrorBoundary>
      )}
      screenOptions={{headerShown: false}}>
      <MainStack.Group>
        {/* Auth Navigator */}
        {isEmpty(user) ? (
          <MainStack.Screen name="AuthStack">
            {props => <AuthNavigator {...props} />}
          </MainStack.Screen>
        ) : (
          // User Navigator
          <MainStack.Screen name="DrawerRoot">
            {props => <DrawerNavigator {...props} />}
          </MainStack.Screen>
        )}
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
