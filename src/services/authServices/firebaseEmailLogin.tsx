//* packages import
import {Alert} from 'react-native';

//* redux import
import {addUser} from '@redux/slices/authSlice';

//* services import
import {loginFirebaseWithEmail} from '@services/firebaseServices/firebaseEmailService';

//* helpers import
import {cleanFirebaseUserResponse} from '@helpers/cleanFirebaseUserResponse';

//* types import
import {AppDispatch} from '@Types/appDispatch';
import {LoginTypes} from '@Types/loginTypes';

interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export const firebaseEmailLogin = (
  credentials: LoginCredentials,
  dispatch: AppDispatch,
  loginType: LoginTypes,
) => {
  loginFirebaseWithEmail(credentials.emailOrPhone, credentials.password)
    .then(user => {
      // Handle successful login
      dispatch(addUser(cleanFirebaseUserResponse(user, loginType)));
      Alert.alert('Login Success', 'You have successfully logged in!');
    })
    .catch(error => {
      // Handle login failure
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during login.',
      );
    });
};
