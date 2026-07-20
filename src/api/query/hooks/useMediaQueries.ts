import {useQuery} from '@tanstack/react-query';

import {mediaCatalogClient} from '@api/clients/mediaCatalogClient';
import {queryKeys} from '@api/query/queryKeys';

export const useMediaVideosQuery = () =>
  useQuery({
    queryKey: queryKeys.media.videos(),
    queryFn: () => mediaCatalogClient.getVideos(),
    staleTime: 1000 * 60 * 30,
  });

export const useMediaAudiosQuery = () =>
  useQuery({
    queryKey: queryKeys.media.audios(),
    queryFn: () => mediaCatalogClient.getAudios(),
    staleTime: 1000 * 60 * 30,
  });
