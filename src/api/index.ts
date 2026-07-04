export {authClient} from '@api/clients/authClient';
export {dashboardClient} from '@api/clients/dashboardClient';
export {feedClient} from '@api/clients/feedClient';
export {deliveryClient} from '@api/clients/deliveryClient';
export {quranClient} from '@api/clients/quranClient';
export {adhkarClient} from '@api/clients/adhkarClient';
export {hadithClient} from '@api/clients/hadithClient';
export {prayerClient} from '@api/clients/prayerClient';

export {queryKeys} from '@api/query/queryKeys';
export {queryClient} from '@api/query/queryClient';

export {useDashboardQuery} from '@api/query/hooks/useDashboardQuery';
export {useFeedQuery} from '@api/query/hooks/useFeedQuery';
export {useLoginMutation, useRegisterMutation} from '@api/query/hooks/useLoginMutation';
export {
  useQuranSurahsQuery,
  useQuranSurahQuery,
  useQuranSearchQuery,
  useAdhkarCategoriesQuery,
  useAdhkarCategoryQuery,
  useHadithEditionsQuery,
  useHadithBooksQuery,
  useHadithListQuery,
  useHadithDetailQuery,
  useHadithSearchQuery,
  usePrayerTimingsQuery,
} from '@api/query/hooks/useIslamicQueries';

export type {DashboardStats} from '@api/mappers/dashboard.mapper';
