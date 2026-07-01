import {
  Controller,
  Get,
  Header,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { MediaService } from './media.service';
import { CreateAudioDto, CreateVideoDto } from './dto/media.dto';

const getBaseUrl = (req: Request): string => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/v1`;
};

@ApiTags('media')
@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Post('upload')
  @ApiOperation({
    summary: 'Upload a file (compatible with RN audios/videos slices)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { protocol: string; get: (h: string) => string | undefined; baseUrl: string; user?: User },
  ) {
    const user = req.user ?? null;
    return this.mediaService.uploadFile(file, user, getBaseUrl(req as Request));
  }

  @Public()
  @Get('files/:fileName')
  @ApiOperation({ summary: 'Download uploaded file' })
  @Header('Cache-Control', 'public, max-age=86400')
  getFile(@Param('fileName') fileName: string) {
    return this.mediaService.getFileStream(fileName);
  }

  @Get('audios')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List audio tracks' })
  listAudios(@CurrentUser() user: User) {
    return this.mediaService.listAudios(user);
  }

  @Post('audios')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create audio metadata after upload' })
  createAudio(
    @Body() dto: CreateAudioDto,
    @CurrentUser() user: User,
    @Req() req: { protocol: string; get: (h: string) => string | undefined; baseUrl: string },
  ) {
    return this.mediaService.createAudio(
      {
        title: dto.title ?? `audio-${Date.now()}`,
        artist: dto.artist ?? 'Unknown Artist',
        album: dto.album ?? `album-${Date.now()}`,
        artwork: dto.artwork ?? 'https://picsum.photos/id/1003/200/300',
        savedFileName: dto.savedFileName,
        url: dto.url,
        duration: dto.duration,
      },
      user,
      getBaseUrl(req as Request),
    );
  }

  @Get('videos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List videos' })
  listVideos(@CurrentUser() user: User) {
    return this.mediaService.listVideos(user);
  }

  @Post('videos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create video metadata after upload' })
  createVideo(
    @Body() dto: CreateVideoDto,
    @CurrentUser() user: User,
    @Req() req: { protocol: string; get: (h: string) => string | undefined; baseUrl: string },
  ) {
    return this.mediaService.createVideo(
      {
        title: dto.title ?? dto.savedFileName,
        description: dto.description ?? 'description',
        subtitle: dto.subtitle ?? `subtitle-${Date.now()}`,
        thumb: dto.thumb ?? 'https://picsum.photos/150/150?image=0',
        savedFileName: dto.savedFileName,
        sources: dto.sources,
      },
      user,
      getBaseUrl(req as Request),
    );
  }
}
