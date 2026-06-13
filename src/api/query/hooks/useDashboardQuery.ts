import {useQuery} from '@tanstack/react-query';

import {dashboardClient} from '@api/clients/dashboardClient';
import {queryKeys} from '@api/query/queryKeys';

export const useDashboardQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: () => dashboardClient.getStats(),
    enabled,
  });
