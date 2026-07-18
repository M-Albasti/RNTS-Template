import {mapHisnCategory, mapHisnItem} from '@api/mappers/islamic.mapper';
import type {HisnCategoryDto, HisnItemDto} from '@api/server/islamic.dto';
import {adhkarHttpClient} from '@config/network/islamicHttpClient';
import type {AdhkarCategory, AdhkarItem, AdhkarLanguage} from '@Types/islamicTypes';

const categoryListPath = (lang: AdhkarLanguage) =>
  lang === 'ar' ? '/ar/husn_ar.json' : '/en/husn_en.json';

const categoryListKey = (lang: AdhkarLanguage) => (lang === 'ar' ? 'العربية' : 'English');

export const adhkarClient = {
  getCategories: async (lang: AdhkarLanguage = 'ar'): Promise<AdhkarCategory[]> => {
    const {data} = await adhkarHttpClient.get<Record<string, HisnCategoryDto[]>>(
      categoryListPath(lang),
    );
    const categories = data[categoryListKey(lang)] ?? [];
    return categories.map(category => mapHisnCategory(category, lang));
  },

  getCategoryItems: async (
    categoryId: number,
    lang: AdhkarLanguage = 'ar',
  ): Promise<{title: string; items: AdhkarItem[]}> => {
    const {data} = await adhkarHttpClient.get<Record<string, HisnItemDto[]>>(
      `/${lang}/${categoryId}.json`,
    );
    const [title, items] = Object.entries(data)[0] ?? ['', []];
    return {
      title,
      items: items.map(mapHisnItem),
    };
  },

  getMorningAdhkar: async (lang: AdhkarLanguage = 'ar') =>
    adhkarClient.getCategoryItems(27, lang),

  getEveningAdhkar: async (lang: AdhkarLanguage = 'ar') =>
    adhkarClient.getCategoryItems(27, lang),

  getRandomDhikr: async (lang: AdhkarLanguage = 'ar'): Promise<AdhkarItem> => {
    const categories = await adhkarClient.getCategories(lang);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const {items} = await adhkarClient.getCategoryItems(category.id, lang);
    const item = items[Math.floor(Math.random() * items.length)];
    return item;
  },

  searchCategories: async (query: string, lang: AdhkarLanguage = 'ar'): Promise<AdhkarCategory[]> => {
    const categories = await adhkarClient.getCategories(lang);
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return categories;
    }
    return categories.filter(category => category.title.toLowerCase().includes(normalized));
  },
};

/** Hisn Muslim category IDs (verified against hisnmuslim.com/api). */
export const ADHKAR_FEATURED_CATEGORY_IDS = {
  morningEvening: 27,
  sleep: 28,
  waking: 1,
  afterPrayer: 25, // الأذكار بعد السلام من الصلاة
  mosque: 12,
  travel: 96,
  food: 69,
  anxiety: 34,
  forgiveness: 129,
} as const;
