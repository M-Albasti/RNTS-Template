import {apiClient} from '@config/network/client';

import type {DashboardStatsDto} from '@api/server/dashboard.dto';
import {mapDashboardDto} from '@api/mappers/dashboard.mapper';

export const dashboardClient = {
  getStats: async () => {
    const {data} = await apiClient.get<DashboardStatsDto>('/dashboard/stats');
    return mapDashboardDto(data);
  },
};
