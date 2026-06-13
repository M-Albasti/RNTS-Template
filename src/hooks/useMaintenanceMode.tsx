import {useCallback, useEffect, useState} from 'react';

import {
  getRemoteConfigBoolean,
  refreshRemoteConfig,
} from '@config/firebaseInit';

import {useAppState} from '@hooks/useAppState';

export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(
    () => getRemoteConfigBoolean('maintenance_mode'),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const appState = useAppState();

  const syncFromRemoteConfig = useCallback(() => {
    setIsMaintenanceMode(getRemoteConfigBoolean('maintenance_mode'));
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshRemoteConfig();
      syncFromRemoteConfig();
    } finally {
      setIsRefreshing(false);
    }
  }, [syncFromRemoteConfig]);

  useEffect(() => {
    if (appState === 'active') {
      void refresh();
    }
  }, [appState, refresh]);

  return {
    isMaintenanceMode,
    isRefreshing,
    refresh,
  };
};
