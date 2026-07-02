import {mapPrayerTimings} from '@api/mappers/islamic.mapper';
import type {PrayerTimingsResponseDto} from '@api/server/islamic.dto';
import {prayerHttpClient} from '@config/network/islamicHttpClient';
import type {PrayerTimings} from '@Types/islamicTypes';

export const prayerClient = {
  getTimingsByCity: async (
    city: string,
    country: string,
    method = 4,
  ): Promise<PrayerTimings> => {
    const {data} = await prayerHttpClient.get<PrayerTimingsResponseDto>(
      '/timingsByCity',
      {
        params: {
          city,
          country,
          method,
        },
      },
    );
    return mapPrayerTimings(data);
  },

  getTimingsByCoords: async (
    latitude: number,
    longitude: number,
    method = 4,
  ): Promise<PrayerTimings> => {
    const {data} = await prayerHttpClient.get<PrayerTimingsResponseDto>(
      '/timings',
      {
        params: {
          latitude,
          longitude,
          method,
        },
      },
    );
    return mapPrayerTimings(data);
  },
};
