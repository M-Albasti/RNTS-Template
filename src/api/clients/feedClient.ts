import {apiClient} from '@config/network/client';

import type {FeedResponseDto} from '@api/server/feed.dto';
import {mapFeedDtoToPosts} from '@api/mappers/feed.mapper';
import type {FeedSort} from '@Types/postTypes';

export const feedClient = {
  getFeed: async (sort: FeedSort = 'recent') => {
    const {data} = await apiClient.get<FeedResponseDto>('/feed', {
      params: {sort},
    });
    return mapFeedDtoToPosts(data);
  },
};
