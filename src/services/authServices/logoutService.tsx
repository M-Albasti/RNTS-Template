//* packages import
import {Alert} from 'react-native';

//* services import
import {firebaseLogout} from './firebaseLogout';
import {firebaseGoogleLogout} from './firebaseGoogleLogout';

//* types import
import {AppDispatch} from '@Types/appDispatch';
import {LoginTypes} from '@Types/loginTypes';

export const logoutService = async (
  loginType: LoginTypes,
  dispatch: AppDispatch,
): Promise<void> => {
  console.log("🚀 ~ loginType:", loginType)
  try {
    if (loginType === 'Normal') {
      /*
       * logic for user logout by empty
       * the user data in redux with
       * dispatch(addUser(null));
       */
    }
    if (loginType === 'FirebaseEmail' || loginType === 'FirebasePhone') {
      firebaseLogout(dispatch);
    }
    if (loginType === 'FirebaseGoogle') {
      firebaseGoogleLogout(dispatch);
    }
  } catch (error) {
    Alert.alert(
      'Unexpected Error',
      'An unexpected error occurred. Please try again later.',
    );
    console.error('Unexpected error:', error);
  }
};
