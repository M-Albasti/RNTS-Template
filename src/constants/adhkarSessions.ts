import {ADHKAR_FEATURED_CATEGORY_IDS} from '@api/clients/adhkarClient';

/**
 * Guided adhkar reading sessions.
 * Morning & evening share Hisn category 27 (الصباح والمساء) for text —
 * continuous audio tracks differ by reciter.
 */
export type AdhkarSessionId =
  | 'morning'
  | 'evening'
  | 'sleep'
  | 'waking'
  | 'afterPrayer'
  | 'dayNight';

export type AdhkarSession = {
  id: AdhkarSessionId;
  categoryId: number;
  titleKey: string;
  subtitleKey: string;
  icon: string;
};

export const ADHKAR_SESSIONS: readonly AdhkarSession[] = [
  {
    id: 'morning',
    categoryId: ADHKAR_FEATURED_CATEGORY_IDS.morningEvening,
    titleKey: 'islamic.adhkar.morning',
    subtitleKey: 'islamic.adhkar.morningSubtitle',
    icon: 'sunny-outline',
  },
  {
    id: 'evening',
    categoryId: ADHKAR_FEATURED_CATEGORY_IDS.morningEvening,
    titleKey: 'islamic.adhkar.evening',
    subtitleKey: 'islamic.adhkar.eveningSubtitle',
    icon: 'cloudy-night-outline',
  },
  {
    id: 'sleep',
    categoryId: ADHKAR_FEATURED_CATEGORY_IDS.sleep,
    titleKey: 'islamic.adhkar.sleep',
    subtitleKey: 'islamic.adhkar.sleepSubtitle',
    icon: 'moon-outline',
  },
  {
    id: 'waking',
    categoryId: ADHKAR_FEATURED_CATEGORY_IDS.waking,
    titleKey: 'islamic.adhkar.waking',
    subtitleKey: 'islamic.adhkar.wakingSubtitle',
    icon: 'partly-sunny-outline',
  },
  {
    id: 'afterPrayer',
    categoryId: ADHKAR_FEATURED_CATEGORY_IDS.afterPrayer,
    titleKey: 'islamic.adhkar.afterPrayer',
    subtitleKey: 'islamic.adhkar.afterPrayerSubtitle',
    icon: 'hand-left-outline',
  },
  {
    id: 'dayNight',
    categoryId: ADHKAR_FEATURED_CATEGORY_IDS.morningEvening,
    titleKey: 'islamic.adhkar.dayNight',
    subtitleKey: 'islamic.adhkar.dayNightSubtitle',
    icon: 'infinite-outline',
  },
] as const;

/** Browse groups shown as cards (no chip filters). */
export type AdhkarCategoryGroupId =
  | 'daily'
  | 'home'
  | 'prayer'
  | 'travel'
  | 'protection'
  | 'other';

export type AdhkarCategoryGroup = {
  id: AdhkarCategoryGroupId;
  titleKey: string;
  subtitleKey: string;
  icon: string;
  /** Match Hisn category titles (Arabic + English). First match wins. */
  match: RegExp;
};

/**
 * Themed groups for the hub grid. Unmatched chapters fall into `other`.
 * Order matters — first matching group claims the category.
 */
export const ADHKAR_CATEGORY_GROUPS: readonly AdhkarCategoryGroup[] = [
  {
    id: 'daily',
    titleKey: 'islamic.adhkar.groups.daily',
    subtitleKey: 'islamic.adhkar.groups.dailySubtitle',
    icon: 'sunny-outline',
    match:
      /صباح|مساء|نوم|استيقاظ|morning|evening|sleep|wake|يوم|ليلة|day|night|استغفار|تسبيح|تهليل/i,
  },
  {
    id: 'home',
    titleKey: 'islamic.adhkar.groups.home',
    subtitleKey: 'islamic.adhkar.groups.homeSubtitle',
    icon: 'home-outline',
    match:
      /منزل|دخول|خروج|طعام|شراب|خلاء|وضوء|لباس|ثوب|مرآة|طعام|home|food|toilet|wudu|ablution|cloth|dress|mirror|eat|drink/i,
  },
  {
    id: 'prayer',
    titleKey: 'islamic.adhkar.groups.prayer',
    subtitleKey: 'islamic.adhkar.groups.prayerSubtitle',
    icon: 'book-outline',
    match:
      /صلاة|أذان|مسجد|تشهد|استخارة|تكبير|prayer|adhan|mosque|salah|salat|istikhara|tashahhud/i,
  },
  {
    id: 'travel',
    titleKey: 'islamic.adhkar.groups.travel',
    subtitleKey: 'islamic.adhkar.groups.travelSubtitle',
    icon: 'airplane-outline',
    match: /سفر|مركوب|طائر|سفينة|travel|journey|ride|vehicle|ship|plane|mount/i,
  },
  {
    id: 'protection',
    titleKey: 'islamic.adhkar.groups.protection',
    subtitleKey: 'islamic.adhkar.groups.protectionSubtitle',
    icon: 'shield-outline',
    match:
      /هم|حزن|خوف|كرب|عين|حسد|مرض|شفاء|رقية|شيطان|وسوسة|anxiety|fear|distress|evil|protection|حماية|illness|sick|ruqyah|devil|whisper/i,
  },
  {
    id: 'other',
    titleKey: 'islamic.adhkar.groups.other',
    subtitleKey: 'islamic.adhkar.groups.otherSubtitle',
    icon: 'grid-outline',
    match: /.^/, // never matches — filled by partition helper
  },
] as const;

/** Groups shown as hub cards (excludes the synthetic other until partition). */
export const ADHKAR_BROWSE_GROUPS = ADHKAR_CATEGORY_GROUPS;

export const getAdhkarSessionById = (id: AdhkarSessionId): AdhkarSession =>
  ADHKAR_SESSIONS.find(session => session.id === id) ?? ADHKAR_SESSIONS[0];

export const getAdhkarGroupById = (id: AdhkarCategoryGroupId): AdhkarCategoryGroup =>
  ADHKAR_CATEGORY_GROUPS.find(group => group.id === id) ??
  ADHKAR_CATEGORY_GROUPS[ADHKAR_CATEGORY_GROUPS.length - 1];

/**
 * Assign every category to exactly one group. Leftovers go to "Other adhkar".
 */
export const partitionCategoriesByGroup = <T extends {title: string}>(
  categories: T[],
): Record<AdhkarCategoryGroupId, T[]> => {
  const result = Object.fromEntries(
    ADHKAR_CATEGORY_GROUPS.map(group => [group.id, [] as T[]]),
  ) as Record<AdhkarCategoryGroupId, T[]>;

  const matchers = ADHKAR_CATEGORY_GROUPS.filter(group => group.id !== 'other');

  for (const category of categories) {
    const matched = matchers.find(group => group.match.test(category.title));
    if (matched) {
      result[matched.id].push(category);
    } else {
      result.other.push(category);
    }
  }

  return result;
};

export const filterCategoriesByGroup = <T extends {title: string}>(
  categories: T[],
  groupId: AdhkarCategoryGroupId,
): T[] => partitionCategoriesByGroup(categories)[groupId] ?? [];
