import axios from 'axios';
import {GOOGLE_MAPS_API_KEY} from '@env';

/**
 * Google Places / Geocoding helpers for prayer location setup.
 * Requires Places + Geocoding APIs enabled on the same Maps key.
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
        fields: 'geometry,address_component,formatted_address',
        key: GOOGLE_MAPS_API_KEY,
      },
    });
    if (data.status !== 'OK' || !data.result?.geometry?.location) {
      return null;
    }
    const components = data.result.address_components;
    const city =
      componentByType(components, 'locality') ||
      componentByType(components, 'administrative_area_level_2') ||
      componentByType(components, 'administrative_area_level_1') ||
      'Unknown';
    const country = componentByType(components, 'country') || 'Unknown';
    return {
      city,
      country,
      latitude: data.result.geometry.location.lat,
      longitude: data.result.geometry.location.lng,
      label: data.result.formatted_address || `${city}, ${country}`,
    };
  },

  reverseGeocode: async (
    latitude: number,
    longitude: number,
  ): Promise<ResolvedPlaceLocation | null> => {
    if (!hasMapsKey()) {
      return {
        city: 'Current location',
        country: '',
        latitude,
        longitude,
        label: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
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
      };
    }
    const components = result.address_components;
    const city =
      componentByType(components, 'locality') ||
      componentByType(components, 'administrative_area_level_2') ||
      componentByType(components, 'administrative_area_level_1') ||
      'Current location';
    const country = componentByType(components, 'country') || '';
    return {
      city,
      country,
      latitude,
      longitude,
      label: result.formatted_address || `${city}, ${country}`,
    };
  },
};
