//* packages import
import {Alert} from 'react-native';
import {
  FirebaseAuthTypes,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from '@react-native-firebase/auth';

/**
 * register user with Firebase by Email.
 * @param email - The Email received by the user to register.
 * @param password - The Password received by the user to register.
 * @returns The authenticated user.
 */
export const registerFirebaseWithEmail = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      getAuth(),
      email,
      password,
    );
    return userCredential.user;
  } catch (error: FirebaseAuthTypes.NativeFirebaseAuthError | any) {
    handleFirebaseError(error);
    throw new Error(error.message);
  }
};

/**
 * login user with Firebase by Email.
 * @param email - The Email received by the user to login.
 * @param password - The Password received by the user to login.
 * @returns The authenticated user.
 */
export const loginFirebaseWithEmail = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.User> => {
  return await signInWithEmailAndPassword(getAuth(), email, password)
    .then(userCredential => {
      return userCredential.user;
    })
    .catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) => {
      handleFirebaseError(error);
      throw new Error(error.message);
    });
};

/**
 * logout user from firebase account.
 */
export const logoutFirebase = async (): Promise<void> => {
  await signOut(getAuth()).catch(
    (error: FirebaseAuthTypes.NativeFirebaseAuthError) => {
      handleFirebaseError(error);
      throw new Error(error.message);
    },
  );
};

const handleFirebaseError = (
  error: FirebaseAuthTypes.NativeFirebaseAuthError,
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
