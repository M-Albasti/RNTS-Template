export const WORD_PUZZLE_STAGES_PER_BOOK = 50;
export const WORD_PUZZLE_PUZZLES_PER_STAGE = 3;
export const WORD_PUZZLE_FETCH_BATCH = 12;

export const ENGLISH_RIDDLE_CATEGORIES = [
  'logic',
  'math',
  'mystery',
  'science',
  'funny',
  'who-am-i',
] as const;

export type EnglishRiddleCategory = (typeof ENGLISH_RIDDLE_CATEGORIES)[number];

export const ARABIC_LAND_GROUPS = [
  {landIndex: 1, categoryIds: [1, 2, 3]},
  {landIndex: 2, categoryIds: [4, 5, 6]},
] as const;

export const ENGLISH_LAND_GROUPS = [
  {landIndex: 1, categories: ['logic', 'math', 'mystery'] as EnglishRiddleCategory[]},
  {landIndex: 2, categories: ['science', 'funny', 'who-am-i'] as EnglishRiddleCategory[]},
] as const;
