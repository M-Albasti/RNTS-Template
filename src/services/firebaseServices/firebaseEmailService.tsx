//* packages import
import {
  FirebaseAuthTypes,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from '@react-native-firebase/auth';

//* services import
import {firebaseErrorHandler} from './firebaseErrorHandler';

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
  return await createUserWithEmailAndPassword(getAuth(), email, password)
    .then(userCredential => {
      return userCredential.user;
    })
    .catch(firebaseErrorHandler);
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
    .catch(firebaseErrorHandler);
};

/**
 * logout user from firebase account.
 */
export const logoutFirebaseUser = async (): Promise<void> => {
  await signOut(getAuth()).catch(firebaseErrorHandler);
};
