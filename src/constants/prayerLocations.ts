/**
 * Curated country → city lists for manual prayer-location selection
 * (fallback when GPS is denied). Cities are Aladhan-friendly names.
 */

export type PrayerCityOption = {
  city: string;
  /** Display label (may include region). */
  label: string;
};

export type PrayerCountryOption = {
  country: string;
  cities: PrayerCityOption[];
};

export const PRAYER_COUNTRIES: readonly PrayerCountryOption[] = [
  {
    country: 'Saudi Arabia',
    cities: [
      {city: 'Mecca', label: 'Mecca'},
      {city: 'Medina', label: 'Medina'},
      {city: 'Riyadh', label: 'Riyadh'},
      {city: 'Jeddah', label: 'Jeddah'},
      {city: 'Dammam', label: 'Dammam'},
    ],
  },
  {
    country: 'United Arab Emirates',
    cities: [
      {city: 'Dubai', label: 'Dubai'},
      {city: 'Abu Dhabi', label: 'Abu Dhabi'},
      {city: 'Sharjah', label: 'Sharjah'},
      {city: 'Ajman', label: 'Ajman'},
    ],
  },
  {
    country: 'Egypt',
    cities: [
      {city: 'Cairo', label: 'Cairo'},
      {city: 'Alexandria', label: 'Alexandria'},
      {city: 'Giza', label: 'Giza'},
    ],
  },
  {
    country: 'Jordan',
    cities: [
      {city: 'Amman', label: 'Amman'},
      {city: 'Irbid', label: 'Irbid'},
      {city: 'Zarqa', label: 'Zarqa'},
    ],
  },
  {
    country: 'Morocco',
    cities: [
      {city: 'Casablanca', label: 'Casablanca'},
      {city: 'Rabat', label: 'Rabat'},
      {city: 'Marrakesh', label: 'Marrakesh'},
      {city: 'Fes', label: 'Fes'},
    ],
  },
  {
    country: 'Turkey',
    cities: [
      {city: 'Istanbul', label: 'Istanbul'},
      {city: 'Ankara', label: 'Ankara'},
      {city: 'Izmir', label: 'Izmir'},
    ],
  },
  {
    country: 'United Kingdom',
    cities: [
      {city: 'London', label: 'London'},
      {city: 'Birmingham', label: 'Birmingham'},
      {city: 'Manchester', label: 'Manchester'},
      {city: 'Leeds', label: 'Leeds'},
    ],
  },
  {
    country: 'France',
    cities: [
      {city: 'Paris', label: 'Paris'},
      {city: 'Lyon', label: 'Lyon'},
      {city: 'Marseille', label: 'Marseille'},
    ],
  },
  {
    country: 'Germany',
    cities: [
      {city: 'Berlin', label: 'Berlin'},
      {city: 'Munich', label: 'Munich'},
      {city: 'Frankfurt', label: 'Frankfurt'},
      {city: 'Cologne', label: 'Cologne'},
    ],
  },
  {
    country: 'United States',
    cities: [
      {city: 'New York', label: 'New York'},
      {city: 'Los Angeles', label: 'Los Angeles'},
      {city: 'Chicago', label: 'Chicago'},
      {city: 'Houston', label: 'Houston'},
      {city: 'Dearborn', label: 'Dearborn'},
    ],
  },
  {
    country: 'Canada',
    cities: [
      {city: 'Toronto', label: 'Toronto'},
      {city: 'Montreal', label: 'Montreal'},
      {city: 'Vancouver', label: 'Vancouver'},
      {city: 'Ottawa', label: 'Ottawa'},
    ],
  },
  {
    country: 'Pakistan',
    cities: [
      {city: 'Karachi', label: 'Karachi'},
      {city: 'Lahore', label: 'Lahore'},
      {city: 'Islamabad', label: 'Islamabad'},
    ],
  },
  {
    country: 'Indonesia',
    cities: [
      {city: 'Jakarta', label: 'Jakarta'},
      {city: 'Surabaya', label: 'Surabaya'},
      {city: 'Bandung', label: 'Bandung'},
    ],
  },
  {
    country: 'Malaysia',
    cities: [
      {city: 'Kuala Lumpur', label: 'Kuala Lumpur'},
      {city: 'Penang', label: 'Penang'},
      {city: 'Johor Bahru', label: 'Johor Bahru'},
    ],
  },
  {
    country: 'India',
    cities: [
      {city: 'Delhi', label: 'Delhi'},
      {city: 'Mumbai', label: 'Mumbai'},
      {city: 'Hyderabad', label: 'Hyderabad'},
      {city: 'Bangalore', label: 'Bangalore'},
    ],
  },
  {
    country: 'Nigeria',
    cities: [
      {city: 'Lagos', label: 'Lagos'},
      {city: 'Kano', label: 'Kano'},
      {city: 'Abuja', label: 'Abuja'},
    ],
  },
  {
    country: 'Algeria',
    cities: [
      {city: 'Algiers', label: 'Algiers'},
      {city: 'Oran', label: 'Oran'},
      {city: 'Constantine', label: 'Constantine'},
    ],
  },
  {
    country: 'Tunisia',
    cities: [
      {city: 'Tunis', label: 'Tunis'},
      {city: 'Sfax', label: 'Sfax'},
    ],
  },
  {
    country: 'Qatar',
    cities: [
      {city: 'Doha', label: 'Doha'},
    ],
  },
  {
    country: 'Kuwait',
    cities: [
      {city: 'Kuwait City', label: 'Kuwait City'},
    ],
  },
  {
    country: 'Bahrain',
    cities: [
      {city: 'Manama', label: 'Manama'},
    ],
  },
  {
    country: 'Oman',
    cities: [
      {city: 'Muscat', label: 'Muscat'},
    ],
  },
] as const;

/**
 * GMT / IANA timezone presets with representative coords for Aladhan.
 * Shown when the user prefers a timezone instead of GPS or city lists.
 */
export type PrayerTimezoneOption = {
  id: string;
  /** IANA zone for Aladhan `timezonestring`. */
  timezone: string;
  /** Human label like "Greenwich, London, UK". */
  labelEn: string;
  labelAr: string;
  /** Approximate GMT label for UI (DST-aware display uses live clock separately). */
  gmtLabel: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
};

export const PRAYER_TIMEZONES: readonly PrayerTimezoneOption[] = [
  {
    id: 'gmt',
    timezone: 'Etc/GMT',
    labelEn: 'Greenwich Mean Time (GMT)',
    labelAr: 'توقيت غرينتش (GMT)',
    gmtLabel: 'GMT+0',
    latitude: 51.4779,
    longitude: -0.0015,
    city: 'Greenwich',
    country: 'United Kingdom',
  },
  {
    id: 'london',
    timezone: 'Europe/London',
    labelEn: 'London, UK',
    labelAr: 'لندن، المملكة المتحدة',
    gmtLabel: 'GMT+0/+1',
    latitude: 51.5074,
    longitude: -0.1278,
    city: 'London',
    country: 'United Kingdom',
  },
  {
    id: 'paris',
    timezone: 'Europe/Paris',
    labelEn: 'Paris, France',
    labelAr: 'باريس، فرنسا',
    gmtLabel: 'GMT+1/+2',
    latitude: 48.8566,
    longitude: 2.3522,
    city: 'Paris',
    country: 'France',
  },
  {
    id: 'berlin',
    timezone: 'Europe/Berlin',
    labelEn: 'Berlin, Germany',
    labelAr: 'برلين، ألمانيا',
    gmtLabel: 'GMT+1/+2',
    latitude: 52.52,
    longitude: 13.405,
    city: 'Berlin',
    country: 'Germany',
  },
  {
    id: 'cairo',
    timezone: 'Africa/Cairo',
    labelEn: 'Cairo, Egypt',
    labelAr: 'القاهرة، مصر',
    gmtLabel: 'GMT+2',
    latitude: 30.0444,
    longitude: 31.2357,
    city: 'Cairo',
    country: 'Egypt',
  },
  {
    id: 'riyadh',
    timezone: 'Asia/Riyadh',
    labelEn: 'Riyadh, Saudi Arabia',
    labelAr: 'الرياض، السعودية',
    gmtLabel: 'GMT+3',
    latitude: 24.7136,
    longitude: 46.6753,
    city: 'Riyadh',
    country: 'Saudi Arabia',
  },
  {
    id: 'dubai',
    timezone: 'Asia/Dubai',
    labelEn: 'Dubai, UAE',
    labelAr: 'دبي، الإمارات',
    gmtLabel: 'GMT+4',
    latitude: 25.2048,
    longitude: 55.2708,
    city: 'Dubai',
    country: 'United Arab Emirates',
  },
  {
    id: 'karachi',
    timezone: 'Asia/Karachi',
    labelEn: 'Karachi, Pakistan',
    labelAr: 'كراتشي، باكستان',
    gmtLabel: 'GMT+5',
    latitude: 24.8607,
    longitude: 67.0011,
    city: 'Karachi',
    country: 'Pakistan',
  },
  {
    id: 'kolkata',
    timezone: 'Asia/Kolkata',
    labelEn: 'Delhi / India (IST)',
    labelAr: 'دلهي / الهند',
    gmtLabel: 'GMT+5:30',
    latitude: 28.6139,
    longitude: 77.209,
    city: 'Delhi',
    country: 'India',
  },
  {
    id: 'jakarta',
    timezone: 'Asia/Jakarta',
    labelEn: 'Jakarta, Indonesia',
    labelAr: 'جاكرتا، إندونيسيا',
    gmtLabel: 'GMT+7',
    latitude: -6.2088,
    longitude: 106.8456,
    city: 'Jakarta',
    country: 'Indonesia',
  },
  {
    id: 'kuala_lumpur',
    timezone: 'Asia/Kuala_Lumpur',
    labelEn: 'Kuala Lumpur, Malaysia',
    labelAr: 'كوالالمبور، ماليزيا',
    gmtLabel: 'GMT+8',
    latitude: 3.139,
    longitude: 101.6869,
    city: 'Kuala Lumpur',
    country: 'Malaysia',
  },
  {
    id: 'new_york',
    timezone: 'America/New_York',
    labelEn: 'New York, USA (ET)',
    labelAr: 'نيويورك، الولايات المتحدة',
    gmtLabel: 'GMT-5/-4',
    latitude: 40.7128,
    longitude: -74.006,
    city: 'New York',
    country: 'United States',
  },
  {
    id: 'chicago',
    timezone: 'America/Chicago',
    labelEn: 'Chicago, USA (CT)',
    labelAr: 'شيكاغو، الولايات المتحدة',
    gmtLabel: 'GMT-6/-5',
    latitude: 41.8781,
    longitude: -87.6298,
    city: 'Chicago',
    country: 'United States',
  },
  {
    id: 'los_angeles',
    timezone: 'America/Los_Angeles',
    labelEn: 'Los Angeles, USA (PT)',
    labelAr: 'لوس أنجلوس، الولايات المتحدة',
    gmtLabel: 'GMT-8/-7',
    latitude: 34.0522,
    longitude: -118.2437,
    city: 'Los Angeles',
    country: 'United States',
  },
  {
    id: 'toronto',
    timezone: 'America/Toronto',
    labelEn: 'Toronto, Canada',
    labelAr: 'تورونتو، كندا',
    gmtLabel: 'GMT-5/-4',
    latitude: 43.6532,
    longitude: -79.3832,
    city: 'Toronto',
    country: 'Canada',
  },
] as const;

export const getCitiesForCountry = (country: string): PrayerCityOption[] =>
  PRAYER_COUNTRIES.find(item => item.country === country)?.cities ?? [];

export const getTimezoneById = (id: string): PrayerTimezoneOption | undefined =>
  PRAYER_TIMEZONES.find(item => item.id === id);
