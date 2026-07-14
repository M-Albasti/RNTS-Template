//* packages import
import {Alert} from 'react-native';

//* services import
import {loginFirebaseWithApple} from '@services/firebaseServices/firebaseAppleService';

//* redux import
import {addUser} from '@redux/slices/authSlice';

//* helpers import
import {cleanFirebaseUserResponse} from '@helpers/cleanFirebaseUserResponse';

//* firebase import
import {
  trackLoginFailure,
  trackLoginSuccess,
} from '@services/firebaseServices/firebaseAuthAnalytics';

//* types import
import {AppDispatch} from '@Types/appDispatch';
import type {UserCredential} from '@Types/firebaseAuthTypes';
import {LoginTypes} from '@Types/loginTypes';

export const firebaseAppleLogin = (
  dispatch: AppDispatch,
  loginType: LoginTypes,
): Promise<void> => {
  return loginFirebaseWithApple()
    .then((user: UserCredential) => {
      // Handle successful login
      dispatch(
        addUser(
          cleanFirebaseUserResponse(
            user?.user,
            loginType,
            user?.additionalUserInfo,
          ),
        ),
      );
      void trackLoginSuccess(loginType);
      Alert.alert('Login Success', 'You have successfully logged in!');
    })
    .catch(error => {
      // Handle login failure
      void trackLoginFailure(
        loginType,
        error.message || 'An error occurred during login.',
      );
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during login.',
      );
    });
};
