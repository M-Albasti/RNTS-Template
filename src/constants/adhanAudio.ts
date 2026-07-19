/**
 * Well-known Adhan MP3s hosted by IslamCan (classic azan1–azan21 set).
 * Used for prayer reminders and the in-app Adhan picker.
 */

export type AdhanAudioOption = {
  id: string;
  nameEn: string;
  nameAr: string;
  reciterEn: string;
  reciterAr: string;
  url: string;
};

const islamCan = (file: string) => `https://www.islamcan.com/audio/adhan/${file}`;

export const ADHAN_AUDIO_OPTIONS: readonly AdhanAudioOption[] = [
  {
    id: 'azan1',
    nameEn: 'Masjid al-Haram (Makkah)',
    nameAr: 'المسجد الحرام (مكة)',
    reciterEn: 'Sheikh Ali Ahmad Mulla',
    reciterAr: 'الشيخ علي أحمد ملا',
    url: islamCan('azan1.mp3'),
  },
  {
    id: 'azan2',
    nameEn: 'Masjid an-Nabawi (Madinah)',
    nameAr: 'المسجد النبوي (المدينة)',
    reciterEn: 'Traditional Madinah Adhan',
    reciterAr: 'أذان المدينة التقليدي',
    url: islamCan('azan2.mp3'),
  },
  {
    id: 'azan3',
    nameEn: 'Al-Aqsa Mosque (Jerusalem)',
    nameAr: 'المسجد الأقصى (القدس)',
    reciterEn: 'Al-Aqsa Adhan',
    reciterAr: 'أذان الأقصى',
    url: islamCan('azan3.mp3'),
  },
  {
    id: 'azan4',
    nameEn: 'Egyptian Adhan',
    nameAr: 'أذان مصري',
    reciterEn: 'Traditional Cairo style',
    reciterAr: 'الطابع المصري التقليدي',
    url: islamCan('azan4.mp3'),
  },
  {
    id: 'azan5',
    nameEn: 'Turkish Adhan',
    nameAr: 'أذان تركي',
    reciterEn: 'Saba melodic style',
    reciterAr: 'طابع تركي لحني',
    url: islamCan('azan5.mp3'),
  },
  {
    id: 'azan6',
    nameEn: 'Soft Adhan',
    nameAr: 'أذان هادئ',
    reciterEn: 'Gentle style',
    reciterAr: 'أسلوب هادئ',
    url: islamCan('azan6.mp3'),
  },
  {
    id: 'azan7',
    nameEn: 'Abdul Basit style',
    nameAr: 'طابع عبد الباسط',
    reciterEn: 'Inspired by Sheikh Abdul Basit',
    reciterAr: 'مستوحى من الشيخ عبد الباسط',
    url: islamCan('azan7.mp3'),
  },
  {
    id: 'azan8',
    nameEn: 'Mishary Alafasy style',
    nameAr: 'طابع مشاري العفاسي',
    reciterEn: 'Inspired by Sheikh Mishary',
    reciterAr: 'مستوحى من الشيخ مشاري',
    url: islamCan('azan8.mp3'),
  },
  {
    id: 'azan9',
    nameEn: 'Classic Adhan 9',
    nameAr: 'أذان كلاسيكي ٩',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan9.mp3'),
  },
  {
    id: 'azan10',
    nameEn: 'Classic Adhan 10',
    nameAr: 'أذان كلاسيكي ١٠',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan10.mp3'),
  },
  {
    id: 'azan11',
    nameEn: 'Classic Adhan 11',
    nameAr: 'أذان كلاسيكي ١١',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan11.mp3'),
  },
  {
    id: 'azan12',
    nameEn: 'Classic Adhan 12',
    nameAr: 'أذان كلاسيكي ١٢',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan12.mp3'),
  },
  {
    id: 'azan13',
    nameEn: 'Classic Adhan 13',
    nameAr: 'أذان كلاسيكي ١٣',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan13.mp3'),
  },
  {
    id: 'azan14',
    nameEn: 'Classic Adhan 14',
    nameAr: 'أذان كلاسيكي ١٤',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan14.mp3'),
  },
  {
    id: 'azan15',
    nameEn: 'Classic Adhan 15',
    nameAr: 'أذان كلاسيكي ١٥',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan15.mp3'),
  },
  {
    id: 'azan16',
    nameEn: 'Classic Adhan 16',
    nameAr: 'أذان كلاسيكي ١٦',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan16.mp3'),
  },
  {
    id: 'azan17',
    nameEn: 'Classic Adhan 17',
    nameAr: 'أذان كلاسيكي ١٧',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan17.mp3'),
  },
  {
    id: 'azan18',
    nameEn: 'Classic Adhan 18',
    nameAr: 'أذان كلاسيكي ١٨',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan18.mp3'),
  },
  {
    id: 'azan19',
    nameEn: 'Classic Adhan 19',
    nameAr: 'أذان كلاسيكي ١٩',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan19.mp3'),
  },
  {
    id: 'azan20',
    nameEn: 'Classic Adhan 20',
    nameAr: 'أذان كلاسيكي ٢٠',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan20.mp3'),
  },
  {
    id: 'azan21',
    nameEn: 'Classic Adhan 21',
    nameAr: 'أذان كلاسيكي ٢١',
    reciterEn: 'Traditional style',
    reciterAr: 'طابع تقليدي',
    url: islamCan('azan21.mp3'),
  },
];

/** Default Madinah-style Adhan. */
export const DEFAULT_ADHAN_SOUND_ID = 'azan2';

/** @deprecated Prefer resolveAdhanAudioUrl / ADHAN_AUDIO_OPTIONS */
export const ADHAN_AUDIO_URL =
  ADHAN_AUDIO_OPTIONS.find(item => item.id === DEFAULT_ADHAN_SOUND_ID)?.url ??
  islamCan('azan2.mp3');

export const getAdhanAudioById = (id: string | null | undefined): AdhanAudioOption => {
  return (
    ADHAN_AUDIO_OPTIONS.find(item => item.id === id) ??
    ADHAN_AUDIO_OPTIONS.find(item => item.id === DEFAULT_ADHAN_SOUND_ID) ??
    ADHAN_AUDIO_OPTIONS[0]
  );
};

export const resolveAdhanAudioUrl = (id: string | null | undefined): string =>
  getAdhanAudioById(id).url;
