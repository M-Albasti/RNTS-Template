import axios from 'axios';
import {GOOGLE_MAPS_API_KEY} from '@env';

/**
 * Google Places / Geocoding / Time Zone helpers for prayer location setup.
 * Requires Places, Geocoding, and Time Zone APIs on the Maps key.
 * No static city/timezone lists — everything is resolved dynamically.
 */

type AutocompletePrediction = {
  description: string;
  place_id: string;
};

type PlaceDetailsResult = {
  geometry?: {location?: {lat: number; lng: number}};
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  formatted_address?: string;
};

export type PlaceCitySuggestion = {
  placeId: string;
  description: string;
};

export type ResolvedPlaceLocation = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  label: string;
  /** IANA timezone from Google Time Zone API when available. */
  timezone: string | null;
  timezoneName: string | null;
};

const mapsHttp = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api',
  timeout: 15000,
});

const hasMapsKey = (): boolean =>
  Boolean(GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY');

const componentByType = (
  components: PlaceDetailsResult['address_components'],
  type: string,
): string | undefined =>
  components?.find(item => item.types.includes(type))?.long_name;

const parsePlace = (
  result: PlaceDetailsResult,
  latitude: number,
  longitude: number,
  fallbackCity: string,
): Omit<ResolvedPlaceLocation, 'timezone' | 'timezoneName'> => {
  const components = result.address_components;
  const city =
    componentByType(components, 'locality') ||
    componentByType(components, 'administrative_area_level_2') ||
    componentByType(components, 'administrative_area_level_1') ||
    fallbackCity;
  const country = componentByType(components, 'country') || '';
  return {
    city,
    country,
    latitude,
    longitude,
    label: result.formatted_address || `${city}${country ? `, ${country}` : ''}`,
  };
};

export const placesClient = {
  isConfigured: hasMapsKey,

  autocompleteCities: async (
    input: string,
    language = 'en',
  ): Promise<PlaceCitySuggestion[]> => {
    if (!hasMapsKey() || input.trim().length < 2) {
      return [];
    }
    const {data} = await mapsHttp.get<{
      status: string;
      predictions?: AutocompletePrediction[];
    }>('/place/autocomplete/json', {
      params: {
        input: input.trim(),
        types: '(cities)',
        language,
        key: GOOGLE_MAPS_API_KEY,
      },
    });
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return [];
    }
    return (data.predictions ?? []).map(item => ({
      placeId: item.place_id,
      description: item.description,
    }));
  },

  /**
   * Resolves IANA timezone for coordinates via Google Time Zone API.
   */
  getTimezone: async (
    latitude: number,
    longitude: number,
  ): Promise<{timezone: string; timezoneName: string} | null> => {
    if (!hasMapsKey()) {
      return null;
    }
    try {
      const {data} = await mapsHttp.get<{
        status: string;
        timeZoneId?: string;
        timeZoneName?: string;
      }>('/timezone/json', {
        params: {
          location: `${latitude},${longitude}`,
          timestamp: Math.floor(Date.now() / 1000),
          key: GOOGLE_MAPS_API_KEY,
        },
      });
      if (data.status !== 'OK' || !data.timeZoneId) {
        return null;
      }
      return {
        timezone: data.timeZoneId,
        timezoneName: data.timeZoneName ?? data.timeZoneId,
      };
    } catch (error) {
      console.log('placesClient.getTimezone Error =>', error);
      return null;
    }
  },

  resolvePlaceId: async (placeId: string): Promise<ResolvedPlaceLocation | null> => {
    if (!hasMapsKey() || !placeId) {
      return null;
    }
    const {data} = await mapsHttp.get<{
      status: string;
      result?: PlaceDetailsResult;
    }>('/place/details/json', {
      params: {
        place_id: placeId,
        fields: 'geometry,address_components,formatted_address',
        key: GOOGLE_MAPS_API_KEY,
      },
    });
    if (data.status !== 'OK' || !data.result?.geometry?.location) {
      return null;
    }
    const latitude = data.result.geometry.location.lat;
    const longitude = data.result.geometry.location.lng;
    const base = parsePlace(data.result, latitude, longitude, 'Unknown');
    const zone = await placesClient.getTimezone(latitude, longitude);
    return {
      ...base,
      timezone: zone?.timezone ?? null,
      timezoneName: zone?.timezoneName ?? null,
    };
  },

  reverseGeocode: async (
    latitude: number,
    longitude: number,
  ): Promise<ResolvedPlaceLocation | null> => {
    const zone = await placesClient.getTimezone(latitude, longitude);

    if (!hasMapsKey()) {
      return {
        city: 'Current location',
        country: '',
        latitude,
        longitude,
        label: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
        timezone: zone?.timezone ?? null,
        timezoneName: zone?.timezoneName ?? null,
      };
    }

    const {data} = await mapsHttp.get<{
      status: string;
      results?: PlaceDetailsResult[];
    }>('/geocode/json', {
      params: {
        latlng: `${latitude},${longitude}`,
        key: GOOGLE_MAPS_API_KEY,
      },
    });
    const result = data.results?.[0];
    if (!result) {
      return {
        city: 'Current location',
        country: '',
        latitude,
        longitude,
        label: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
        timezone: zone?.timezone ?? null,
        timezoneName: zone?.timezoneName ?? null,
      };
    }
    const base = parsePlace(result, latitude, longitude, 'Current location');
    return {
      ...base,
      timezone: zone?.timezone ?? null,
      timezoneName: zone?.timezoneName ?? null,
    };
  },
};
