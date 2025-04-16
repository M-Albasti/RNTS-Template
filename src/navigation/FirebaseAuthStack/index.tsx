//* packages import
import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//* screens import
import FirebaseLoginMethod from '@screens/firebaseLoginMethod';
import FirebaseEmailLogin from '@screens/firebaseAuth/firebaseEmailLogin';
import FirebaseEmailRegister from '@screens/firebaseAuth/firebaseEmailRegister';

//* types import
import {RootStackParamList} from '@Types/appNavigation';

//* components import
import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

//* styles import
import {styles} from './styles';

const FirebaseStack = createNativeStackNavigator<RootStackParamList>();

const FirebaseAuthStackNavigator = (props: any): React.JSX.Element => {
  return (
    <FirebaseStack.Navigator
      initialRouteName="FirebaseLoginMethod"
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
      <FirebaseStack.Group>
        <FirebaseStack.Screen name="FirebaseLoginMethod">
          {props => <FirebaseLoginMethod {...props} />}
        </FirebaseStack.Screen>
        <FirebaseStack.Screen name="FirebaseEmailLogin">
          {props => <FirebaseEmailLogin {...props} />}
        </FirebaseStack.Screen>
        <FirebaseStack.Screen name="FirebaseEmailRegister">
          {props => <FirebaseEmailRegister {...props} />}
        </FirebaseStack.Screen>
      </FirebaseStack.Group>
    </FirebaseStack.Navigator>
  );
};

export default FirebaseAuthStackNavigator;
