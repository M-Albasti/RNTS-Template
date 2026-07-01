import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audio, MediaFile, Video } from './entities/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaFile, Audio, Video])],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
