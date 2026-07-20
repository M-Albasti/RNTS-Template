import type {SoundProps} from '@Types/soundProps';
import type {VideoProps} from '@Types/videoProps';

export type MediaVideoDto = {
  id: string;
  title: string;
  description: string;
  subtitle: string;
  thumb: string;
  url: string;
};

export type MediaAudioDto = {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  url: string;
  duration?: number;
};

export type MediaVideosResponseDto = {items: MediaVideoDto[]};
export type MediaAudiosResponseDto = {items: MediaAudioDto[]};

export const mapMediaVideoDto = (dto: MediaVideoDto): VideoProps => ({
  title: dto.title,
  description: dto.description,
  subtitle: dto.subtitle,
  thumb: dto.thumb,
  sources: [dto.url],
});

export const mapMediaAudioDto = (dto: MediaAudioDto): SoundProps => ({
  id: dto.id,
  title: dto.title,
  artist: dto.artist,
  album: dto.album,
  artwork: dto.artwork,
  url: dto.url,
  duration: dto.duration,
});
