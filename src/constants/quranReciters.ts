export type QuranReciterSource = 'cdn' | 'everyayah';

export type QuranReciter = {
  id: string;
  nameAr: string;
  nameEn: string;
  source: QuranReciterSource;
  folder?: string;
};

/** Popular reciters — Al Quran Cloud CDN + Yasser Al-Dossari via everyayah.com */
export const QURAN_RECITERS: QuranReciter[] = [
  {id: 'ar.alafasy', nameAr: 'مشاري العفاسي', nameEn: 'Mishary Alafasy', source: 'cdn'},
  {
    id: 'yasser-dossari',
    nameAr: 'ياسر الدوسري',
    nameEn: 'Yasser Al-Dossari',
    source: 'everyayah',
    folder: 'Yasser_Ad-Dussary_128kbps',
  },
  {
    id: 'ar.abdurrahmaansudais',
    nameAr: 'عبد الرحمن السديس',
    nameEn: 'Abdurrahman As-Sudais',
    source: 'cdn',
  },
  {id: 'ar.saoodshuraym', nameAr: 'سعود الشريم', nameEn: 'Saood Ash-Shuraym', source: 'cdn'},
  {id: 'ar.husary', nameAr: 'محمود خليل الحصري', nameEn: 'Mahmoud Khalil Al-Husary', source: 'cdn'},
  {id: 'ar.minshawi', nameAr: 'محمد صديق المنشاوي', nameEn: 'Mohamed Siddiq Al-Minshawi', source: 'cdn'},
  {id: 'ar.mahermuaiqly', nameAr: 'ماهر المعيقلي', nameEn: 'Maher Al Muaiqly', source: 'cdn'},
  {id: 'ar.abdulbasitmurattal', nameAr: 'عبد الباسط عبد الصمد', nameEn: 'Abdul Basit', source: 'cdn'},
  {id: 'ar.hudhaify', nameAr: 'علي الحذيفي', nameEn: 'Ali Al-Hudhaify', source: 'cdn'},
  {id: 'ar.shaatree', nameAr: 'أبو بكر الشاطري', nameEn: 'Abu Bakr Ash-Shaatree', source: 'cdn'},
];

export const DEFAULT_QURAN_RECITER_ID = 'ar.alafasy';

export const getQuranReciterById = (id: string): QuranReciter =>
  QURAN_RECITERS.find(reciter => reciter.id === id) ?? QURAN_RECITERS[0];
