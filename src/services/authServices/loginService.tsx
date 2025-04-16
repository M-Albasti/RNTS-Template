//* packages import
import {Dispatch} from 'redux';
import {Alert} from 'react-native';
import {z} from 'zod';

//* redux import
import {addUser} from '@redux/slices/authSlice';

//* services import
import {loginFirebaseWithEmail} from '@services/firebaseServices/firebaseEmailService';

//* helpers import
import {cleanFirebaseUser} from '@helpers/cleanFirebaseUser';

//* utils import
import loginValidation from '@utils/loginValidation';

//* types import
// import {AppStackNavigationProp} from '@Types/appNavigation';

interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export const loginService = async (
  loginType: string,
  credentials: LoginCredentials,
  //   navigation: AppStackNavigationProp<'Login' | 'FirebaseEmailLogin'>,
  dispatch: Dispatch,
): Promise<void> => {
  try {
    loginValidation.parse(credentials); // Validate data
    if (loginType === 'firebase') {
      loginFirebaseWithEmail(credentials.emailOrPhone, credentials.password)
        .then(user => {
          // Handle successful login
          dispatch(addUser(cleanFirebaseUser(user)));
          Alert.alert('Login Success', 'You have successfully logged in!');
        })
        .catch(error => {
          // Handle login failure
          Alert.alert(
            'Login Failed',
            error.message || 'An error occurred during login.',
          );
        });
      Alert.alert('Validation Success', 'Your inputs are valid!');
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message).join('\n');
      Alert.alert('Validation Error', errorMessages);
    }
  }
};
