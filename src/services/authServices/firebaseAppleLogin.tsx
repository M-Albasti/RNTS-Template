//* packages import
import {Alert} from 'react-native';

//* services import
import {loginFirebaseWithApple} from '@services/firebaseServices/firebaseAppleService';

//* redux import
import {addUser} from '@redux/slices/authSlice';

//* helpers import
import {cleanFirebaseUserResponse} from '@helpers/cleanFirebaseUserResponse';

//* types import
import {AppDispatch} from '@Types/appDispatch';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {LoginTypes} from '@Types/loginTypes';

export const firebaseAppleLogin = (
  dispatch: AppDispatch,
  loginType: LoginTypes,
) => {
  loginFirebaseWithApple()
    .then((user: FirebaseAuthTypes.UserCredential) => {
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
