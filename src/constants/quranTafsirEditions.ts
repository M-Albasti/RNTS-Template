export type QuranTafsirEdition = {
  id: string;
  nameAr: string;
  nameEn: string;
};

export const QURAN_TAFSIR_EDITIONS: QuranTafsirEdition[] = [
  {id: 'ar.muyassar', nameAr: 'التفسير الميسر', nameEn: 'Al-Muyassar'},
  {id: 'ar.jalalayn', nameAr: 'تفسير الجلالين', nameEn: 'Al-Jalalayn'},
  {id: 'ar.baghawi', nameAr: 'تفسير البغوي', nameEn: 'Al-Baghawi'},
  {id: 'ar.qurtubi', nameAr: 'تفسير القرطبي', nameEn: 'Al-Qurtubi'},
  {id: 'ar.waseet', nameAr: 'التفسير الوسيط', nameEn: 'Al-Waseet'},
];

export const DEFAULT_TAFSIR_EDITION_ID = 'ar.muyassar';
