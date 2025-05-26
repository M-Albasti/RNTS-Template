//* packages import
import {Alert} from 'react-native';

//* redux import
import {addUser} from '@redux/slices/authSlice';

//* services import
import {logoutGoogleUser} from '@services/firebaseServices/firebaseGoogleService';

//* types import
import {AppDispatch} from '@Types/appDispatch';

export const firebaseGoogleLogout = (dispatch: AppDispatch) => {
  logoutGoogleUser()
    .then(() => {
      dispatch(addUser(null));
      Alert.alert(
        'Logout Successful',
        'You have been logged out successfully.',
      );
    })
    .catch(error => {
      Alert.alert(
        'Logout Failed',
        'An error occurred while logging out. Please try again.',
      );
      console.error('Logout error:', error);
    });
};
