//* packages import
import {Alert} from 'react-native';
import {ZodError} from 'zod';
import {isEmpty} from 'lodash';

//* services import
import {firebaseEmailLogin} from '@services/authServices/firebaseEmailLogin';
import {firebasePhoneLogin} from '@services/authServices/firebasePhoneLogin';
import {firebaseGoogleLogin} from '@services/authServices/firebaseGoogleLogin';
import {firebaseFacebookLogin} from '@services/authServices/firebaseFacebookLogin';
import {firebaseAppleLogin} from '@services/authServices/firebaseAppleLogin';

//* utils import
import loginValidation from '@utils/loginValidation';

//* types import
import {LoginTypes} from '@Types/loginTypes';
import {AppDispatch} from '@Types/appDispatch';

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
      } else if (loginType === 'FirebaseFacebook') {
        firebaseFacebookLogin(dispatch, loginType);
      } else if (loginType === 'FirebaseApple') {
        firebaseAppleLogin(dispatch, loginType);
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map(err => err.message).join('\n');
      Alert.alert('Validation Error', errorMessages);
    }
  }
};
