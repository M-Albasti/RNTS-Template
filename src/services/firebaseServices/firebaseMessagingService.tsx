import notifee, {AndroidImportance} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

import {logAnalyticsEvent} from '@services/firebaseServices/firebaseAnalyticsService';
import {recordCrashError} from '@services/firebaseServices/firebaseCrashlyticsService';

export const FCM_CHANNEL_ID = 'fcm-default';

const isAuthorizedStatus = (status: FirebaseMessagingTypes.AuthorizationStatus) =>
  status === messaging.AuthorizationStatus.AUTHORIZED ||
  status === messaging.AuthorizationStatus.PROVISIONAL;

export const ensureFcmNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: FCM_CHANNEL_ID,
      name: 'Push notifications',
      importance: AndroidImportance.HIGH,
    });
  }
};

export const requestAndroidNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android' || Platform.Version < 33) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

export const requestFirebasePushPermission = async (): Promise<boolean> => {
  try {
    const androidGranted = await requestAndroidNotificationPermission();
    if (!androidGranted) {
      return false;
    }

    if (Platform.OS === 'ios') {
      const status = await messaging().requestPermission();
      return isAuthorizedStatus(status);
    }

    const status = await messaging().hasPermission();
    return isAuthorizedStatus(status);
  } catch (error) {
    recordCrashError(error, 'requestFirebasePushPermission');
    return false;
  }
};

export const registerDeviceForRemoteMessages = async () => {
  if (Platform.OS !== 'ios') {
    return;
  }

  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }
};

export const getFirebaseMessagingToken = async (): Promise<string | null> => {
  try {
    await registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    return token || null;
  } catch (error) {
    console.log('Firebase Messaging getToken Error =>', error);
    recordCrashError(error, 'getFirebaseMessagingToken');
    return null;
  }
};

export const displayFirebaseRemoteMessage = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  await ensureFcmNotificationChannel();

  const title =
    remoteMessage.notification?.title ??
    remoteMessage.data?.title ??
    'Notification';
  const body =
    remoteMessage.notification?.body ??
    remoteMessage.data?.body ??
    remoteMessage.data?.message ??
    '';

  await notifee.displayNotification({
    title: String(title),
    body: String(body),
    data: remoteMessage.data,
    android: {
      channelId: FCM_CHANNEL_ID,
      pressAction: {id: 'default'},
      smallIcon: 'ic_launcher',
    },
    ios: {
      sound: 'default',
    },
  });
};

export const handleFirebaseBackgroundMessage = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  if (remoteMessage.notification) {
    return;
  }

  await displayFirebaseRemoteMessage(remoteMessage);
};

export const initFirebaseMessaging = async (): Promise<string | null> => {
  try {
    await ensureFcmNotificationChannel();

    const status = await messaging().hasPermission();
    if (!isAuthorizedStatus(status)) {
      return null;
    }

    const token = await getFirebaseMessagingToken();
    if (token) {
      await logAnalyticsEvent('fcm_token_refreshed', {has_token: true});
    }
    return token;
  } catch (error) {
    console.log('Firebase Messaging init Error =>', error);
    recordCrashError(error, 'initFirebaseMessaging');
    return null;
  }
};

export const registerFirebasePushNotifications = async (): Promise<string | null> => {
  const granted = await requestFirebasePushPermission();
  if (!granted) {
    return null;
  }

  const token = await getFirebaseMessagingToken();
  if (token) {
    await logAnalyticsEvent('push_permission_granted');
  }
  return token;
};

export const deleteFirebaseMessagingToken = async () => {
  try {
    await messaging().deleteToken();
  } catch (error) {
    recordCrashError(error, 'deleteFirebaseMessagingToken');
  }
};
