import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedSort, Post } from './entities/post.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async getFeed(sort: FeedSort = 'recent') {
    const posts = await this.postsRepository.find();
    const sorted =
      sort === 'popular'
        ? [...posts].sort((a, b) => b.likes - a.likes)
        : [...posts].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );

    return {
      items: sorted.map((post) => ({
        id: post.id,
        author: post.author,
        avatar: post.avatar,
        content: post.content,
        mediaType: post.mediaType,
        mediaUrl: post.mediaUrl ?? undefined,
        likes: post.likes,
        likedByMe: false,
        myReaction: null,
        shares: 0,
        comments: post.comments,
        hashtags: post.hashtags,
        poll: post.poll ?? undefined,
        createdAt: post.createdAt.toISOString(),
      })),
      sort,
    };
  }
}
