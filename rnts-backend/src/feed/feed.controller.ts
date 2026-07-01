import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { FeedService } from './feed.service';

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get social feed posts' })
  @ApiQuery({ name: 'sort', enum: ['recent', 'popular'], required: false })
  getFeed(@Query('sort') sort?: string) {
    const feedSort = sort === 'popular' ? 'popular' : 'recent';
    return this.feedService.getFeed(feedSort);
  }
}
