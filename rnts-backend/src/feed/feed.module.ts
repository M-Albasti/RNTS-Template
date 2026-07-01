import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
