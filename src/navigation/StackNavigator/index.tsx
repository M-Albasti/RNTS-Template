//* packages import
import React, {Suspense} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import _ from 'lodash';

//* navigators import
import DrawerNavigator from '../DrawerNavigator';
import AuthStackNavigator from '@navigation/AuthStack';

//* screens import
import Settings from '@screens/settings';
import NotFound from '@screens/notFound';

//* hooks import
import {useAppSelector} from '@hooks/useAppSelector';

//* types import
import {RootStackParamList} from '@Types/appNavigation';

//* components import
import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

//* styles import
import {styles} from './styles';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = (props: any): React.JSX.Element => {
  const user = useAppSelector(state => state.auth.user);
  console.log('🚀 ~ StackNavigator user:', user, _.isEmpty(user));

  return (
    <Stack.Navigator
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
            <SafeAreaView style={styles.container}>{children}</SafeAreaView>
          </Suspense>
        </ErrorBoundary>
      )}
      screenOptions={{headerShown: false}}>
      <Stack.Group>
        {/* Auth Navigator */}
        {_.isEmpty(user) ? (
          <Stack.Screen name="AuthStack">
            {props => <AuthStackNavigator {...props} />}
          </Stack.Screen>
        ) : (
          // User Navigator
          <Stack.Screen name="DrawerRoot">
            {props => <DrawerNavigator {...props} />}
          </Stack.Screen>
        )}
        <Stack.Screen name="NotFound">
          {props => <NotFound {...props} />}
        </Stack.Screen>
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name="Settings">
          {props => <Settings {...props} />}
        </Stack.Screen>
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackNavigator;
