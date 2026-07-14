import React, {useEffect} from 'react';
import {
  getInitialNotification,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
} from '@react-native-firebase/messaging';

import {getFirebaseMessaging} from '@config/firebaseInstances';
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

    const messaging = getFirebaseMessaging();

    const unsubscribeToken = onTokenRefresh(messaging, token => {
      dispatch(setFcmToken(token));
    });

    const unsubscribeMessage = onMessage(messaging, async remoteMessage => {
      await displayFirebaseRemoteMessage(remoteMessage);
    });

    const unsubscribeOpened = onNotificationOpenedApp(messaging, remoteMessage => {
      console.log('Notification opened app from background:', remoteMessage?.messageId);
    });

    getInitialNotification(messaging)
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
