//* packages import
import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//* screens import
import Login from '@screens/auth/login';
import Register from '@screens/auth/register';
import ForgetPassword from '@screens/auth/forgetPassword';
import ResetPassword from '@screens/auth/resetPassword';
import OTP from '@screens/auth/otp';
import OnBoarding from '@screens/onboarding';
import AuthMethod from '@screens/authMethod';

//* components import
import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

//* navigators import
import FirebaseAuthStackNavigator from '@navigation/FirebaseAuthStack';

//* types import
import {RootStackParamList} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

const AuthStack = createNativeStackNavigator<RootStackParamList>();

const AuthStackNavigator = (props: any): React.JSX.Element => {
  return (
    <AuthStack.Navigator
      initialRouteName="OnBoarding"
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
      <AuthStack.Group>
        <AuthStack.Screen name="OnBoarding">
          {props => <OnBoarding {...props} />}
        </AuthStack.Screen>
        <AuthStack.Screen name="AuthMethod">
          {props => <AuthMethod {...props} />}
        </AuthStack.Screen>
        <AuthStack.Screen name="FirebaseAuthStack">
          {props => <FirebaseAuthStackNavigator {...props} />}
        </AuthStack.Screen>
        <AuthStack.Screen name="Login">
          {props => <Login {...props} />}
        </AuthStack.Screen>
        <AuthStack.Screen name="Register">
          {props => <Register {...props} />}
        </AuthStack.Screen>
        <AuthStack.Screen name="ForgetPassword">
          {props => <ForgetPassword {...props} />}
        </AuthStack.Screen>
        <AuthStack.Screen name="ResetPassword">
          {props => <ResetPassword {...props} />}
        </AuthStack.Screen>
        <AuthStack.Screen name="OTP">
          {props => <OTP {...props} />}
        </AuthStack.Screen>
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
