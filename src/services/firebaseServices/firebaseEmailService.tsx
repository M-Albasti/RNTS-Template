//* packages import
import {Alert} from 'react-native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

export const registerFirebaseWithEmail = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.User> => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    return userCredential.user;
  } catch (error: FirebaseAuthTypes.NativeFirebaseAuthError | any) {
    handleFirebaseError(error);
    throw new Error(error.message);
  }
};

export const loginFirebaseWithEmail = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.User> => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    return userCredential.user;
  } catch (error: FirebaseAuthTypes.NativeFirebaseAuthError | any) {
    handleFirebaseError(error);
    throw new Error(error.message);
  }
};

export const logoutFirebase = async (): Promise<void> => {
  try {
    await auth().signOut();
  } catch (error: FirebaseAuthTypes.NativeFirebaseAuthError | any) {
    handleFirebaseError(error);
    throw new Error(error.message);
  }
};

const handleFirebaseError = (
  error: FirebaseAuthTypes.NativeFirebaseAuthError | any,
): void => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      console.log('That email address is already in use!');
      Alert.alert(
        'Something Went Wrong',
        'That email address is already in use!\nPlease try another one.',
      );
      break;
    case 'auth/invalid-email':
      console.log('That email address is invalid!');
      Alert.alert(
        'Something Went Wrong',
        'That email address is invalid!\nPlease try another one.',
      );
      break;
    case 'auth/user-not-found':
      console.log('No user found with this email!');
      Alert.alert('Something Went Wrong', 'No user found with this email!');
      break;
    case 'auth/wrong-password':
      console.log('Incorrect password!');
      Alert.alert('Something Went Wrong', 'Incorrect password!');
      break;
    default:
      console.log('An unknown error occurred:', error.message);
      Alert.alert('Something Went Wrong', error.message);
  }
};
