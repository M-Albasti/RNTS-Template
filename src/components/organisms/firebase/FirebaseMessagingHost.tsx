import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {setFcmToken} from '@redux/slices/islamicSlice';
import {
  displayFirebaseRemoteMessage,
  getFirebaseMessagingToken,
} from '@services/firebaseServices/firebaseMessagingService';

const FirebaseMessagingHost = (): null => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const syncToken = async () => {
      const token = await getFirebaseMessagingToken();
      dispatch(setFcmToken(token));
    };

    syncToken().catch(() => undefined);

    const unsubscribeToken = messaging().onTokenRefresh(token => {
      dispatch(setFcmToken(token));
    });

    const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
      await displayFirebaseRemoteMessage(remoteMessage);
    });

    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app from background:', remoteMessage?.messageId);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification opened app from quit state:', remoteMessage.messageId);
        }
      })
      .catch(() => undefined);

    return () => {
      unsubscribeToken();
      unsubscribeMessage();
      unsubscribeOpened();
    };
  }, [dispatch]);

  return null;
};

export default FirebaseMessagingHost;
