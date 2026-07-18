/**
 * Arabic display names for well-known Hadislam editions.
 * API often omits `name.ar` — this keeps the bilingual book cards beautiful.
 */
export const HADITH_EDITION_NAME_AR: Record<string, string> = {
  'sahih-al-bukhari': 'صحيح البخاري',
  'sahih-muslim': 'صحيح مسلم',
  'sunan-abu-dawud': 'سنن أبي داود',
  'sunan-al-tirmidhi': 'سنن الترمذي',
  'sunan-an-nasai': 'سنن النسائي',
  'sunan-ibn-majah': 'سنن ابن ماجه',
  'forty-hadith-of-an-nawawi': 'الأربعون النووية',
  'forty-hadith-qudsi': 'الأربعون القدسية',
  'mishkat-al-masabih': 'مشكاة المصابيح',
  'riyad-as-salihin': 'رياض الصالحين',
  'bulugh-al-maram': 'بلوغ المرام',
  'al-adab-al-mufrad': 'الأدب المفرد',
};

export const getHadithEditionNameAr = (slug: string, fallback = ''): string =>
  HADITH_EDITION_NAME_AR[slug] || fallback;
