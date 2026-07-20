import {apiClient} from '@config/network/client';

import {
  mapMediaAudioDto,
  mapMediaVideoDto,
  type MediaAudiosResponseDto,
  type MediaVideosResponseDto,
} from '@api/server/media.dto';
import type {SoundProps} from '@Types/soundProps';
import type {VideoProps} from '@Types/videoProps';

export const mediaCatalogClient = {
  getVideos: async (): Promise<VideoProps[]> => {
    const {data} = await apiClient.get<MediaVideosResponseDto>('/media/videos');
    return (data.items ?? []).map(mapMediaVideoDto);
  },

  getAudios: async (): Promise<SoundProps[]> => {
    const {data} = await apiClient.get<MediaAudiosResponseDto>('/media/audios');
    return (data.items ?? []).map(mapMediaAudioDto);
  },
};
