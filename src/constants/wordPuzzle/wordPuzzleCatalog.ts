import {buildGridForWord} from '@helpers/hexGridHelpers';
import type {
  WordPuzzleBook,
  WordPuzzleItem,
  WordPuzzleLanguage,
  WordPuzzleStage,
} from '@Types/wordPuzzleTypes';

type PuzzleTemplate = {
  id: string;
  type: WordPuzzleItem['type'];
  clue: WordPuzzleItem['clue'];
  answers: string[];
};

const createPuzzle = (
  template: PuzzleTemplate,
  language: WordPuzzleLanguage,
  seed: number,
): WordPuzzleItem => {
  const answer = template.answers[0];
  const {grid, solutionPath} = buildGridForWord(answer, language, seed);
  return {
    id: template.id,
    type: template.type,
    clue: template.clue,
    answers: template.answers,
    grid,
    solutionPath,
  };
};

const ARABIC_TEMPLATES: PuzzleTemplate[] = [
  {
    id: 'prophet-ismail',
    type: 'image_riddle',
    clue: {type: 'image_riddle', emojis: ['🔪', '🐑'], captionKey: 'wordPuzzle.clues.ismail'},
    answers: ['إسماعيل'],
  },
  {
    id: 'surah-baqarah',
    type: 'quran_ayah',
    clue: {type: 'quran_ayah', textKey: 'wordPuzzle.clues.ayatKursiSurah'},
    answers: ['البقرة', 'القرآن'],
  },
  {
    id: 'fatihah-count',
    type: 'quran_ayah_count',
    clue: {type: 'quran_ayah_count', textKey: 'wordPuzzle.clues.fatihahAyahCount'},
    answers: ['سبعة', '7'],
  },
  {
    id: 'prophet-musa',
    type: 'text_riddle',
    clue: {type: 'text_riddle', textKey: 'wordPuzzle.clues.staffSea'},
    answers: ['موسى'],
  },
  {
    id: 'prophet-yunus',
    type: 'image_riddle',
    clue: {type: 'image_riddle', emojis: ['🐋', '🙏'], captionKey: 'wordPuzzle.clues.yunus'},
    answers: ['يونس'],
  },
  {
    id: 'surah-ikhlas',
    type: 'quran_ayah',
    clue: {type: 'quran_ayah', textKey: 'wordPuzzle.clues.shortSurahTauhid'},
    answers: ['الاخلاص', 'الإخلاص'],
  },
  {
    id: 'prophet-yusuf',
    type: 'image_riddle',
    clue: {type: 'image_riddle', emojis: ['👔', '🌙'], captionKey: 'wordPuzzle.clues.yusuf'},
    answers: ['يوسف'],
  },
  {
    id: 'prophet-ibrahim',
    type: 'text_riddle',
    clue: {type: 'text_riddle', textKey: 'wordPuzzle.clues.kabaBuilder'},
    answers: ['إبراهيم', 'ابراهيم'],
  },
  {
    id: 'surah-nas',
    type: 'quran_ayah',
    clue: {type: 'quran_ayah', textKey: 'wordPuzzle.clues.lastSurah'},
    answers: ['الناس'],
  },
  {
    id: 'prophet-nuh',
    type: 'image_riddle',
    clue: {type: 'image_riddle', emojis: ['🚢', '🌧️'], captionKey: 'wordPuzzle.clues.nuh'},
    answers: ['نوح'],
  },
];

const ENGLISH_TEMPLATES: PuzzleTemplate[] = [
  {
    id: 'fruit-banana',
    type: 'image_riddle',
    clue: {type: 'image_riddle', emojis: ['🍌', '🐒'], captionKey: 'wordPuzzle.clues.yellowFruit'},
    answers: ['banana'],
  },
  {
    id: 'planet-red',
    type: 'text_riddle',
    clue: {type: 'text_riddle', textKey: 'wordPuzzle.clues.redPlanet'},
    answers: ['mars'],
  },
  {
    id: 'animal-king',
    type: 'image_riddle',
    clue: {type: 'image_riddle', emojis: ['🦁', '👑'], captionKey: 'wordPuzzle.clues.jungleKing'},
    answers: ['lion'],
  },
  {
    id: 'weather-rain',
    type: 'text_riddle',
    clue: {type: 'text_riddle', textKey: 'wordPuzzle.clues.skyWater'},
    answers: ['rain'],
  },
  {
    id: 'food-bread',
    type: 'image_riddle',
    clue: {type: 'image_riddle', emojis: ['🍞', '🧈'], captionKey: 'wordPuzzle.clues.breakfastLoaf'},
    answers: ['bread'],
  },
  {
    id: 'space-star',
    type: 'text_riddle',
    clue: {type: 'text_riddle', textKey: 'wordPuzzle.clues.nightLight'},
    answers: ['star'],
  },
  {
    id: 'ocean-fish',
    type: 'image_riddle',
    clue: {type: 'image_riddle', emojis: ['🌊', '🐟'], captionKey: 'wordPuzzle.clues.swimsInSea'},
    answers: ['fish'],
  },
  {
    id: 'school-book',
    type: 'text_riddle',
    clue: {type: 'text_riddle', textKey: 'wordPuzzle.clues.readPages'},
    answers: ['book'],
  },
  {
    id: 'travel-train',
    type: 'image_riddle',
    clue: {type: 'image_riddle', emojis: ['🚆', '🛤️'], captionKey: 'wordPuzzle.clues.railRide'},
    answers: ['train'],
  },
  {
    id: 'color-grass',
    type: 'text_riddle',
    clue: {type: 'text_riddle', textKey: 'wordPuzzle.clues.grassColor'},
    answers: ['green'],
  },
];

const buildStages = (
  language: WordPuzzleLanguage,
  bookId: string,
  templates: PuzzleTemplate[],
  stageCount: number,
): WordPuzzleStage[] =>
  Array.from({length: stageCount}, (_, index) => {
    const stageNumber = index + 1;
    const puzzles = [0, 1, 2].map(puzzleIndex => {
      const template = templates[(index * 3 + puzzleIndex) % templates.length];
      return createPuzzle(
        {
          ...template,
          id: `${bookId}-s${stageNumber}-p${puzzleIndex + 1}`,
        },
        language,
        stageNumber * 10 + puzzleIndex,
      );
    });

    return {
      id: `${bookId}-stage-${stageNumber}`,
      number: stageNumber,
      titleKey: 'wordPuzzle.stageTitle',
      puzzles,
    };
  });

export const ARABIC_BOOKS: WordPuzzleBook[] = [
  {
    id: 'ar-land-prophets',
    language: 'ar',
    titleKey: 'wordPuzzle.books.arProphets.title',
    landKey: 'wordPuzzle.books.arProphets.land',
    bookmarkNumber: 1,
    stages: buildStages('ar', 'ar-land-prophets', ARABIC_TEMPLATES, 50),
  },
  {
    id: 'ar-land-quran',
    language: 'ar',
    titleKey: 'wordPuzzle.books.arQuran.title',
    landKey: 'wordPuzzle.books.arQuran.land',
    bookmarkNumber: 2,
    stages: buildStages('ar', 'ar-land-quran', ARABIC_TEMPLATES.slice().reverse(), 50),
  },
];

export const ENGLISH_BOOKS: WordPuzzleBook[] = [
  {
    id: 'en-land-discovery',
    language: 'en',
    titleKey: 'wordPuzzle.books.enDiscovery.title',
    landKey: 'wordPuzzle.books.enDiscovery.land',
    bookmarkNumber: 1,
    stages: buildStages('en', 'en-land-discovery', ENGLISH_TEMPLATES, 50),
  },
  {
    id: 'en-land-nature',
    language: 'en',
    titleKey: 'wordPuzzle.books.enNature.title',
    landKey: 'wordPuzzle.books.enNature.land',
    bookmarkNumber: 2,
    stages: buildStages('en', 'en-land-nature', ENGLISH_TEMPLATES.slice().reverse(), 50),
  },
];

export const getBookById = (bookId: string): WordPuzzleBook | undefined =>
  [...ARABIC_BOOKS, ...ENGLISH_BOOKS].find(book => book.id === bookId);

export const getStageById = (bookId: string, stageId: string) =>
  getBookById(bookId)?.stages.find(stage => stage.id === stageId);
