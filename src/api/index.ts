export {authClient} from '@api/clients/authClient';
export {dashboardClient} from '@api/clients/dashboardClient';
export {feedClient} from '@api/clients/feedClient';
export {deliveryClient} from '@api/clients/deliveryClient';

export {queryKeys} from '@api/query/queryKeys';
export {queryClient} from '@api/query/queryClient';

export {useDashboardQuery} from '@api/query/hooks/useDashboardQuery';
export {useFeedQuery} from '@api/query/hooks/useFeedQuery';
export {useLoginMutation, useRegisterMutation} from '@api/query/hooks/useLoginMutation';

export type {DashboardStats} from '@api/mappers/dashboard.mapper';
