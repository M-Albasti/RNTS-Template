import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { Audio, MediaFile, Video } from './entities/media.entity';
import { CreateAudioDto, CreateVideoDto } from './dto/media.dto';

@Injectable()
export class MediaService {
  private readonly uploadDir: string;

  constructor(
    @InjectRepository(MediaFile)
    private readonly mediaRepository: Repository<MediaFile>,
    @InjectRepository(Audio)
    private readonly audioRepository: Repository<Audio>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    private readonly configService: ConfigService,
  ) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  getFileUrl(savedFileName: string, baseUrl: string): string {
    return `${baseUrl}/files/${savedFileName}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    user: User | null,
    baseUrl: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const ext = extname(file.originalname) || '';
    const savedFileName = `${uuidv4()}${ext}`;
    const fs = await import('fs/promises');
    await fs.writeFile(join(this.uploadDir, savedFileName), file.buffer);

    const media = this.mediaRepository.create({
      savedFileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      user,
    });
    await this.mediaRepository.save(media);

    return {
      savedFileName,
      url: this.getFileUrl(savedFileName, baseUrl),
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async getFileStream(savedFileName: string): Promise<StreamableFile> {
    const filePath = join(this.uploadDir, savedFileName);
    if (!existsSync(filePath)) {
      const media = await this.mediaRepository.findOne({ where: { savedFileName } });
      if (!media) {
        throw new NotFoundException('File not found');
      }
    }
    const stream = createReadStream(filePath);
    return new StreamableFile(stream);
  }

  async listAudios(user?: User) {
    const where = user ? { user: { id: user.id } } : {};
    const audios = await this.audioRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return audios.map((a) => ({
      id: a.id,
      title: a.title,
      artist: a.artist,
      album: a.album,
      artwork: a.artwork,
      url: a.url,
      duration: a.duration,
    }));
  }

  async createAudio(dto: CreateAudioDto, user: User, baseUrl: string) {
    const audio = this.audioRepository.create({
      ...dto,
      url: dto.url ?? this.getFileUrl(dto.savedFileName, baseUrl),
      user,
    });
    await this.audioRepository.save(audio);
    return {
      id: audio.id,
      title: audio.title,
      artist: audio.artist,
      album: audio.album,
      artwork: audio.artwork,
      url: audio.url,
      duration: audio.duration,
    };
  }

  async listVideos(user?: User) {
    const where = user ? { user: { id: user.id } } : {};
    const videos = await this.videoRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return videos.map((v) => ({
      title: v.title,
      description: v.description,
      subtitle: v.subtitle,
      thumb: v.thumb,
      sources: v.sources,
    }));
  }

  async createVideo(dto: CreateVideoDto, user: User, baseUrl: string) {
    const sources =
      dto.sources ??
      [this.getFileUrl(dto.savedFileName, baseUrl)];
    const video = this.videoRepository.create({
      ...dto,
      sources,
      user,
    });
    await this.videoRepository.save(video);
    return {
      title: video.title,
      description: video.description,
      subtitle: video.subtitle,
      thumb: video.thumb,
      sources: video.sources,
    };
  }
}
