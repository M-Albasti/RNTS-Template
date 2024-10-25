import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigation from './DrawerNavigation';
import Settings from '@screens/settings';
import NotFound from '@screens/notFound';
import Login from '@screens/auth/login';
import Register from '@screens/auth/register';
import ForgetPassword from '@screens/auth/forgetPassword';
import ResetPassword from '@screens/auth/resetPassword';
import OTP from '@screens/auth/otp';

const Stack = createNativeStackNavigator();

const StackNavigation = (props: any): React.JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Group>
        <Stack.Screen name="Login">
          {props => <Login {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {props => <Register {...props} />}
        </Stack.Screen>
        <Stack.Screen name="ForgetPassword">
          {props => <ForgetPassword {...props} />}
        </Stack.Screen>
        <Stack.Screen name="ResetPassword">
          {props => <ResetPassword {...props} />}
        </Stack.Screen>
        <Stack.Screen name="OTP">{props => <OTP {...props} />}</Stack.Screen>
        <Stack.Screen name="DrawerRoot">
          {props => <DrawerNavigation {...props} />}
        </Stack.Screen>
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

export default StackNavigation;
