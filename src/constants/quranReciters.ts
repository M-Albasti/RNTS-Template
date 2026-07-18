/**
 * Continuous full-surah reciters from mp3quran.net (Hafs ‘an ‘Asim — Murattal).
 * Audio URLs are complete surah files (no ayah-by-ayah gaps).
 * Source: https://www.mp3quran.net/api/v3/reciters
 */
export type QuranReciter = {
  id: string;
  nameAr: string;
  nameEn: string;
  /** Base URL ending with `/` — append `001.mp3` … `114.mp3` */
  server: string;
};

export const QURAN_RECITERS: QuranReciter[] = [
  {
    id: '92',
    nameAr: 'ياسر الدوسري',
    nameEn: 'Yasser Al-Dosari',
    server: 'https://server11.mp3quran.net/yasser/',
  },
  {
    id: '102',
    nameAr: 'ماهر المعيقلي',
    nameEn: 'Maher Al-Muaiqly',
    server: 'https://server12.mp3quran.net/maher/',
  },
  {
    id: '123',
    nameAr: 'مشاري العفاسي',
    nameEn: 'Mishary Al-Afasy',
    server: 'https://server8.mp3quran.net/afs/',
  },
  {
    id: '54',
    nameAr: 'عبد الرحمن السديس',
    nameEn: 'Abdul Rahman Al-Sudais',
    server: 'https://server11.mp3quran.net/sds/',
  },
  {
    id: '31',
    nameAr: 'سعود الشريم',
    nameEn: 'Saud Al-Shuraim',
    server: 'https://server7.mp3quran.net/shur/',
  },
  {
    id: '112',
    nameAr: 'محمد صديق المنشاوي',
    nameEn: 'Mohamed Siddiq Al-Minshawi',
    server: 'https://server10.mp3quran.net/minsh/',
  },
  {
    id: '118',
    nameAr: 'محمود خليل الحصري',
    nameEn: 'Mahmoud Khalil Al-Husary',
    server: 'https://server13.mp3quran.net/husr/',
  },
  {
    id: '51',
    nameAr: 'عبد الباسط عبد الصمد',
    nameEn: 'Abdul Basit Abdus Samad',
    server: 'https://server7.mp3quran.net/basit/',
  },
  {
    id: '86',
    nameAr: 'ناصر القطامي',
    nameEn: 'Nasser Al-Qatami',
    server: 'https://server6.mp3quran.net/qtm/',
  },
  {
    id: '81',
    nameAr: 'فارس عباد',
    nameEn: 'Fares Abbad',
    server: 'https://server8.mp3quran.net/frs_a/',
  },
  {
    id: '76',
    nameAr: 'علي جابر',
    nameEn: 'Ali Jaber',
    server: 'https://server11.mp3quran.net/a_jbr/',
  },
  {
    id: '4',
    nameAr: 'أبو بكر الشاطري',
    nameEn: 'Abu Bakr Al-Shatri',
    server: 'https://server11.mp3quran.net/shatri/',
  },
  {
    id: '20',
    nameAr: 'خالد الجليل',
    nameEn: 'Khalid Al-Jalil',
    server: 'https://server10.mp3quran.net/jleel/',
  },
  {
    id: '62',
    nameAr: 'عبدالله عواد الجهني',
    nameEn: 'Abdullah Awad Al-Juhani',
    server: 'https://server13.mp3quran.net/jhn/',
  },
  {
    id: '109',
    nameAr: 'محمد أيوب',
    nameEn: 'Muhammad Ayyub',
    server: 'https://server8.mp3quran.net/ayyub/',
  },
  {
    id: '111',
    nameAr: 'محمد جبريل',
    nameEn: 'Muhammad Jibreel',
    server: 'https://server8.mp3quran.net/jbrl/',
  },
  {
    id: '89',
    nameAr: 'هاني الرفاعي',
    nameEn: 'Hani Al-Rifai',
    server: 'https://server8.mp3quran.net/hani/',
  },
  {
    id: '46',
    nameAr: 'صلاح بو خاطر',
    nameEn: 'Salah Bukhatir',
    server: 'https://server8.mp3quran.net/bu_khtr/',
  },
  {
    id: '217',
    nameAr: 'بندر بليله',
    nameEn: 'Bandar Baleelah',
    server: 'https://server6.mp3quran.net/balilah/',
  },
  {
    id: '12',
    nameAr: 'إدريس أبكر',
    nameEn: 'Idris Abkar',
    server: 'https://server6.mp3quran.net/abkr/',
  },
  {
    id: '106',
    nameAr: 'محمد الطبلاوي',
    nameEn: 'Muhammad Al-Tablawi',
    server: 'https://server12.mp3quran.net/tblawi/',
  },
  {
    id: '121',
    nameAr: 'محمود علي البنا',
    nameEn: 'Mahmoud Ali Al-Banna',
    server: 'https://server8.mp3quran.net/bna/',
  },
];

export const DEFAULT_QURAN_RECITER_ID = '92';

const LEGACY_RECITER_MAP: Record<string, string> = {
  'ar.alafasy': '123',
  'yasser-dossari': '92',
  'ar.abdurrahmaansudais': '54',
  'ar.saoodshuraym': '31',
  'ar.husary': '118',
  'ar.minshawi': '112',
  'ar.mahermuaiqly': '102',
  'ar.abdulbasitmurattal': '51',
  'ar.hudhaify': '4',
  'ar.shaatree': '4',
};

export const getQuranReciterById = (id: string): QuranReciter => {
  const resolved = LEGACY_RECITER_MAP[id] ?? id;
  return QURAN_RECITERS.find(reciter => reciter.id === resolved) ?? QURAN_RECITERS[0];
};

/** Total Madinah mushaf pages (Hafs). */
export const MUSHAF_PAGE_COUNT = 604;
