import {useQuery} from '@tanstack/react-query';

import {feedClient} from '@api/clients/feedClient';
import {queryKeys} from '@api/query/queryKeys';
import type {FeedSort} from '@Types/postTypes';

export const useFeedQuery = (sort: FeedSort = 'recent') =>
  useQuery({
    queryKey: queryKeys.feed(sort),
    queryFn: () => feedClient.getFeed(sort),
  });
