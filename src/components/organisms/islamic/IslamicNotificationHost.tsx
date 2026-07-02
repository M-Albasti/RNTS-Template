import React, {useEffect} from 'react';

import {useAppSelector} from '@hooks/useAppSelector';
import {refreshIslamicNotificationSchedule} from '@services/islamicServices/islamicNotificationService';

const IslamicNotificationHost = (): null => {
  const notificationSettings = useAppSelector(
    state => state.islamic.notificationSettings,
  );

  useEffect(() => {
    refreshIslamicNotificationSchedule(notificationSettings).catch(() => undefined);
  }, [notificationSettings]);

  return null;
};

export default IslamicNotificationHost;
