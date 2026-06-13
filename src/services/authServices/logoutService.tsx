//* packages import
import {Alert} from 'react-native';

//* services import
import {apiLogoutService} from '@services/authServices/apiLoginService';
import {firebaseLogout} from '@services/authServices/firebaseLogout';
import {firebaseGoogleLogout} from '@services/authServices/firebaseGoogleLogout';
import {firebaseFacebookLogout} from '@services/authServices/firebaseFacebookLogout';
import {firebaseAppleLogout} from '@services/authServices/firebaseAppleLogout';

//* types import
import {AppDispatch} from '@Types/appDispatch';
import {LoginTypes} from '@Types/loginTypes';

export const logoutService = async (
  loginType: LoginTypes,
  dispatch: AppDispatch,
): Promise<void> => {
  try {
    if (loginType === 'Normal') {
      apiLogoutService(dispatch);
      return;
    }
    if (loginType === 'FirebaseEmail' || loginType === 'FirebasePhone') {
      firebaseLogout(dispatch);
    }
    if (loginType === 'FirebaseGoogle') {
      firebaseGoogleLogout(dispatch);
    }
    if (loginType === 'FirebaseFacebook') {
      firebaseFacebookLogout(dispatch);
    }
    if (loginType === 'FirebaseApple') {
      firebaseAppleLogout(dispatch);
    }
  } catch (error) {
    Alert.alert(
      'Unexpected Error',
      'An unexpected error occurred. Please try again later.',
    );
    console.error('Unexpected error:', error);
  }
};
