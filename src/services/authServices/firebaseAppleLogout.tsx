//* packages import
import {Alert} from 'react-native';

//* redux import
import {addUser} from '@redux/slices/authSlice';

//* services import
import {logoutAppleUser} from '@services/firebaseServices/firebaseAppleService';

//* types import
import {AppDispatch} from '@Types/appDispatch';

export const firebaseAppleLogout = (dispatch: AppDispatch) => {
  logoutAppleUser()
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
