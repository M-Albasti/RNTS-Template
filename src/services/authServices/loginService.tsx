//* packages import
import {Alert} from 'react-native';
import {ZodError} from 'zod';

//* services import
import {firebaseEmailLogin} from './firebaseEmailLogin';
import {firebasePhoneLogin} from './firebasePhoneLogin';
import {firebaseGoogleLogin} from './firebaseGoogleLogin';

//* utils import
import loginValidation from '@utils/loginValidation';

//* types import
import {LoginTypes} from '@Types/loginTypes';
import {AppDispatch} from '@Types/appDispatch';
import {isEmpty} from 'lodash';

interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

/**
 * Authenticates a user based on login type and credentials.
 * @param loginType - The type of login method (Email or Phone).
 * @param credentials - The login credentials.
 * @param dispatch - Redux dispatch function.
 */
export const loginService = async (
  loginType: LoginTypes,
  dispatch: AppDispatch,
  credentials?: LoginCredentials,
): Promise<void> => {
  try {
    // login with credentials
    if (!isEmpty(credentials)) {
      loginValidation.parse(credentials); // Validate data
      if (loginType === 'FirebaseEmail') {
        firebaseEmailLogin(credentials, dispatch, loginType);
      } else if (loginType === 'FirebasePhone') {
        firebasePhoneLogin(credentials, loginType);
      }
    } else {
      if (loginType === 'FirebaseGoogle') {
        firebaseGoogleLogin(dispatch, loginType);
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map(err => err.message).join('\n');
      Alert.alert('Validation Error', errorMessages);
    }
  }
};
