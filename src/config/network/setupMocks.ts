import {apiConfig} from '@config/apiConfig';
import {getMockAdapter} from '@config/mockApi';
import {registerAuthMocks} from '@api/mocks/authMocks';
import {registerDashboardMocks} from '@api/mocks/dashboardMocks';
import {registerFeedMocks} from '@api/mocks/feedMocks';

let mocksRegistered = false;

/** Attach mock handlers when `apiConfig.useMocks` is enabled. Safe to call multiple times. */
export const setupApiMocks = (): void => {
  if (!apiConfig.useMocks || mocksRegistered) return;

  const mock = getMockAdapter();
  registerAuthMocks(mock);
  registerDashboardMocks(mock);
  registerFeedMocks(mock);
  mocksRegistered = true;
};
