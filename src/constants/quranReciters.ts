/**
 * Quran reciters — continuous murattal surah files from mp3quran.net.
 * Ayah highlight uses mp3quran `/ayat_timing` (see `getTimingReadId`).
 */
export type QuranReciter = {
  id: string;
  nameAr: string;
  nameEn: string;
  /** Continuous surah base URL ending with `/` — append `001.mp3` … `114.mp3`. */
  server: string;
  /** Legacy everyayah folder id (kept for compatibility; not used for playback). */
  everyayahFolder: string;
};

const FALLBACK_EVERYAYAH = 'Alafasy_128kbps';

export const QURAN_RECITERS: QuranReciter[] = [
  {
    id: '92',
    nameAr: 'ياسر الدوسري',
    nameEn: 'Yasser Al-Dosari',
    server: 'https://server11.mp3quran.net/yasser/',
    everyayahFolder: 'Yasser_Ad-Dussary_128kbps',
  },
  {
    id: '102',
    nameAr: 'ماهر المعيقلي',
    nameEn: 'Maher Al-Muaiqly',
    server: 'https://server12.mp3quran.net/maher/',
    everyayahFolder: 'Maher_AlMuaiqly_64kbps',
  },
  {
    id: '123',
    nameAr: 'مشاري العفاسي',
    nameEn: 'Mishary Al-Afasy',
    server: 'https://server8.mp3quran.net/afs/',
    everyayahFolder: 'Alafasy_128kbps',
  },
  {
    id: '54',
    nameAr: 'عبد الرحمن السديس',
    nameEn: 'Abdul Rahman Al-Sudais',
    server: 'https://server11.mp3quran.net/sds/',
    everyayahFolder: 'Abdurrahmaan_As-Sudais_192kbps',
  },
  {
    id: '31',
    nameAr: 'سعود الشريم',
    nameEn: 'Saud Al-Shuraim',
    server: 'https://server7.mp3quran.net/shur/',
    everyayahFolder: 'Saood_ash-Shuraym_128kbps',
  },
  {
    id: '112',
    nameAr: 'محمد صديق المنشاوي',
    nameEn: 'Mohamed Siddiq Al-Minshawi',
    server: 'https://server10.mp3quran.net/minsh/',
    everyayahFolder: 'Minshawy_Murattal_128kbps',
  },
  {
    id: '118',
    nameAr: 'محمود خليل الحصري',
    nameEn: 'Mahmoud Khalil Al-Husary',
    server: 'https://server13.mp3quran.net/husr/',
    everyayahFolder: 'Husary_128kbps',
  },
  {
    id: '51',
    nameAr: 'عبد الباسط عبد الصمد',
    nameEn: 'Abdul Basit Abdus Samad',
    server: 'https://server7.mp3quran.net/basit/',
    everyayahFolder: 'Abdul_Basit_Murattal_192kbps',
  },
  {
    id: '86',
    nameAr: 'ناصر القطامي',
    nameEn: 'Nasser Al-Qatami',
    server: 'https://server6.mp3quran.net/qtm/',
    everyayahFolder: 'Nasser_Alqatami_128kbps',
  },
  {
    id: '81',
    nameAr: 'فارس عباد',
    nameEn: 'Fares Abbad',
    server: 'https://server8.mp3quran.net/frs_a/',
    everyayahFolder: 'Fares_Abbad_64kbps',
  },
  {
    id: '76',
    nameAr: 'علي جابر',
    nameEn: 'Ali Jaber',
    server: 'https://server11.mp3quran.net/a_jbr/',
    everyayahFolder: 'Ali_Jaber_64kbps',
  },
  {
    id: '4',
    nameAr: 'أبو بكر الشاطري',
    nameEn: 'Abu Bakr Al-Shatri',
    server: 'https://server11.mp3quran.net/shatri/',
    everyayahFolder: 'Abu_Bakr_Ash-Shaatree_128kbps',
  },
  {
    id: '20',
    nameAr: 'خالد الجليل',
    nameEn: 'Khalid Al-Jalil',
    server: 'https://server10.mp3quran.net/jleel/',
    everyayahFolder: FALLBACK_EVERYAYAH,
  },
  {
    id: '62',
    nameAr: 'عبدالله عواد الجهني',
    nameEn: 'Abdullah Awad Al-Juhani',
    server: 'https://server13.mp3quran.net/jhn/',
    everyayahFolder: 'Abdullaah_3awwaad_Al-Juhaynee_128kbps',
  },
  {
    id: '109',
    nameAr: 'محمد أيوب',
    nameEn: 'Muhammad Ayyub',
    server: 'https://server8.mp3quran.net/ayyub/',
    everyayahFolder: 'Muhammad_Ayyoub_128kbps',
  },
  {
    id: '111',
    nameAr: 'محمد جبريل',
    nameEn: 'Muhammad Jibreel',
    server: 'https://server8.mp3quran.net/jbrl/',
    everyayahFolder: 'Muhammad_Jibreel_128kbps',
  },
  {
    id: '89',
    nameAr: 'هاني الرفاعي',
    nameEn: 'Hani Al-Rifai',
    server: 'https://server8.mp3quran.net/hani/',
    everyayahFolder: 'Hani_Rifai_192kbps',
  },
  {
    id: '46',
    nameAr: 'صلاح بو خاطر',
    nameEn: 'Salah Bukhatir',
    server: 'https://server8.mp3quran.net/bu_khtr/',
    everyayahFolder: 'Salaah_AbdulRahman_Bukhatir_128kbps',
  },
  {
    id: '217',
    nameAr: 'بندر بليله',
    nameEn: 'Bandar Baleelah',
    server: 'https://server6.mp3quran.net/balilah/',
    everyayahFolder: FALLBACK_EVERYAYAH,
  },
  {
    id: '12',
    nameAr: 'إدريس أبكر',
    nameEn: 'Idris Abkar',
    server: 'https://server6.mp3quran.net/abkr/',
    everyayahFolder: FALLBACK_EVERYAYAH,
  },
  {
    id: '106',
    nameAr: 'محمد الطبلاوي',
    nameEn: 'Muhammad Al-Tablawi',
    server: 'https://server12.mp3quran.net/tblawi/',
    everyayahFolder: 'Mohammad_al_Tablaway_128kbps',
  },
  {
    id: '121',
    nameAr: 'محمود علي البنا',
    nameEn: 'Mahmoud Ali Al-Banna',
    server: 'https://server8.mp3quran.net/bna/',
    everyayahFolder: 'Mahmoud_Ali_Al_Banna_32kbps',
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

/**
 * mp3quran ayat_timing `read` id for a reciter.
 * Null when no timing track matches our continuous murattal audio.
 */
const TIMING_READ_OVERRIDES: Record<string, number | null> = {
  // Audio is murattal `basit/`; timing id 51 is Mojawwad.
  '51': 53,
  // Maher murattal has no timing entry (only Mojawwad).
  '102': null,
};

/** Resolves the mp3quran timing `read` id used with continuous surah audio. */
export const getTimingReadId = (reciterId: string): number | null => {
  const resolved = LEGACY_RECITER_MAP[reciterId] ?? reciterId;
  if (Object.prototype.hasOwnProperty.call(TIMING_READ_OVERRIDES, resolved)) {
    return TIMING_READ_OVERRIDES[resolved] ?? null;
  }
  const numeric = Number(resolved);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
};

/** Total Madinah mushaf pages (Hafs). */
export const MUSHAF_PAGE_COUNT = 604;
