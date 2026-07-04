import type MockAdapter from 'axios-mock-adapter';

import type {DashboardStatsDto} from '@api/server/dashboard.dto';

const dashboardStats: DashboardStatsDto = {
  postsCount: 4,
  openTodos: 2,
  unreadChats: 3,
  walletBalance: 1280,
  gameCoins: 450,
};

export const registerDashboardMocks = (mock: MockAdapter): void => {
  mock.onGet('/dashboard/stats').reply(200, dashboardStats);
};
