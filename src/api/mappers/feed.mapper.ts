import type {FeedResponseDto, PostItemDto} from '@api/server/feed.dto';
import type {FeedSort, PostItem} from '@Types/postTypes';

export const mapPostDtoToModel = (dto: PostItemDto): PostItem => ({...dto});

export const mapFeedDtoToPosts = (dto: FeedResponseDto): PostItem[] =>
  dto.items.map(mapPostDtoToModel);

export const mapFeedSortToQuery = (sort: FeedSort): FeedSort => sort;
