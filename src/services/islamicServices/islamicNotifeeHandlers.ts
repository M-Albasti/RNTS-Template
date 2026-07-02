import notifee, {EventType} from '@notifee/react-native';

import {
  buildIslamicNotificationPayload,
  displayIslamicNotification,
} from '@services/islamicServices/islamicNotificationService';
import type {IslamicNotificationSettings} from '@Types/islamicTypes';

const defaultSettings: IslamicNotificationSettings = {
  enabled: true,
  hourlyReminders: true,
  includeQuran: true,
  includeHadith: true,
  includeAdhkar: true,
};

export const handleIslamicNotifeeEvent = async (type: EventType) => {
  if (
    type === EventType.DELIVERED ||
    type === EventType.TRIGGER_NOTIFICATION_CREATED ||
    type === EventType.PRESS
  ) {
    const payload = await buildIslamicNotificationPayload(defaultSettings);
    await displayIslamicNotification(payload);
  }
};

export const registerIslamicNotifeeHandlers = () => {
  notifee.onForegroundEvent(async ({type}) => {
    await handleIslamicNotifeeEvent(type);
  });

  notifee.onBackgroundEvent(async ({type}) => {
    await handleIslamicNotifeeEvent(type);
  });
};
