import React from 'react';

import {useDriverBackgroundTracking} from '@hooks/useDriverBackgroundTracking';

/**
 * Invisible host that keeps driver location updates alive app-wide.
 */
const DriverBackgroundTrackingHost = (): null => {
  useDriverBackgroundTracking();
  return null;
};

export default DriverBackgroundTrackingHost;
