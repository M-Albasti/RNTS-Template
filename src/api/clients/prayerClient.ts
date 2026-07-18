import {mapPrayerTimings} from '@api/mappers/islamic.mapper';
import type {PrayerTimingsResponseDto} from '@api/server/islamic.dto';
import {prayerHttpClient} from '@config/network/islamicHttpClient';
import {toAladhanDateParam} from '@helpers/prayerScheduleHelpers';
import type {PrayerTimings} from '@Types/islamicTypes';

export const prayerClient = {
  getTimingsByCity: async (
    city: string,
    country: string,
    method = 4,
    date?: Date,
  ): Promise<PrayerTimings> => {
    const dateParam = date ? toAladhanDateParam(date) : undefined;
    const path = dateParam ? `/timingsByCity/${dateParam}` : '/timingsByCity';
    const {data} = await prayerHttpClient.get<PrayerTimingsResponseDto>(path, {
      params: {
        city,
        country,
        method,
      },
    });
    return mapPrayerTimings(data);
  },

  getTimingsByCoords: async (
    latitude: number,
    longitude: number,
    method = 4,
    timezonestring?: string,
    date?: Date,
  ): Promise<PrayerTimings> => {
    const dateParam = date ? toAladhanDateParam(date) : undefined;
    const path = dateParam ? `/timings/${dateParam}` : '/timings';
    const {data} = await prayerHttpClient.get<PrayerTimingsResponseDto>(path, {
      params: {
        latitude,
        longitude,
        method,
        ...(timezonestring ? {timezonestring} : {}),
      },
    });
    return mapPrayerTimings(data);
  },

  getTimingsByAddress: async (
    address: string,
    method = 4,
    date?: Date,
  ): Promise<PrayerTimings> => {
    const dateParam = date ? toAladhanDateParam(date) : undefined;
    const path = dateParam ? `/timingsByAddress/${dateParam}` : '/timingsByAddress';
    const {data} = await prayerHttpClient.get<PrayerTimingsResponseDto>(path, {
      params: {
        address,
        method,
      },
    });
    return mapPrayerTimings(data);
  },
};
