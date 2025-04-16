//* packages import
import {Dispatch} from 'redux';
import {Alert} from 'react-native';
import {z} from 'zod';

//* redux import
import {addUser} from '@redux/slices/authSlice';

//* types import
import {logoutFirebase} from '@services/firebaseServices/firebaseEmailService';

export const logoutService = async (
  loginType: string,
  dispatch: Dispatch,
): Promise<void> => {
  try {
    if (loginType === 'firebase') {
      logoutFirebase()
        .then(() => {
          dispatch(addUser({}));
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
    }
  } catch (error) {
    Alert.alert(
      'Unexpected Error',
      'An unexpected error occurred. Please try again later.',
    );
    console.error('Unexpected error:', error);
  }
};
