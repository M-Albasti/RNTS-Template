import {
  buildStageFromPuzzles,
  buildStageSummaries,
  mapArabicCategoryToBook,
  mapEnglishCategoryToBook,
  mapEnglishRiddleToPuzzle,
  mapIslamicQuestionToPuzzle,
} from '@api/mappers/wordPuzzle.mapper';
import type {EnglishRiddleCategory} from '@constants/wordPuzzle/wordPuzzleConfig';
import {
  WORD_PUZZLE_FETCH_BATCH,
  WORD_PUZZLE_PUZZLES_PER_STAGE,
  WORD_PUZZLE_STAGES_PER_BOOK,
} from '@constants/wordPuzzle/wordPuzzleConfig';
import {
  englishRiddlesClient,
  islamicQuizClient,
} from '@config/network/wordPuzzleHttpClient';
import type {
  EnglishRiddlesBulkDto,
  IslamicQuizCategoryDto,
  IslamicQuizPagedQuestionsDto,
} from '@api/server/wordPuzzle.dto';
import type {
  WordPuzzleBookSummary,
  WordPuzzleLanguage,
  WordPuzzleStage,
  WordPuzzleStageSummary,
} from '@Types/wordPuzzleTypes';

const parseArabicBookId = (bookId: string) => Number(bookId.replace('ar-cat-', ''));
const parseEnglishBookId = (bookId: string) => bookId.replace('en-riddle-', '') as EnglishRiddleCategory;

const mapQuestionsToStagePuzzles = (
  questions: Parameters<typeof mapIslamicQuestionToPuzzle>[0][],
  seedBase: number,
) => {
  const puzzles = [];
  for (const question of questions) {
    const puzzle = mapIslamicQuestionToPuzzle(question, seedBase + question.id);
    if (puzzle) {
      puzzles.push(puzzle);
    }
    if (puzzles.length >= WORD_PUZZLE_PUZZLES_PER_STAGE) {
      break;
    }
  }
  return puzzles;
};

export const wordPuzzleClient = {
  getArabicBooks: async (): Promise<WordPuzzleBookSummary[]> => {
    const {data} = await islamicQuizClient.get<IslamicQuizCategoryDto[]>('/categories');
    return data.map((category, index) => mapArabicCategoryToBook(category, index + 1));
  },

  getEnglishBooks: async (): Promise<WordPuzzleBookSummary[]> => {
    const categories: EnglishRiddleCategory[] = [
      'logic',
      'math',
      'mystery',
      'science',
      'funny',
      'who-am-i',
    ];
    return categories.map((category, index) => mapEnglishCategoryToBook(category, index + 1));
  },

  getBooks: async (language: WordPuzzleLanguage): Promise<WordPuzzleBookSummary[]> =>
    language === 'ar' ? wordPuzzleClient.getArabicBooks() : wordPuzzleClient.getEnglishBooks(),

  getBookSummary: async (bookId: string): Promise<WordPuzzleBookSummary | null> => {
    const language: WordPuzzleLanguage = bookId.startsWith('ar-') ? 'ar' : 'en';
    const books = await wordPuzzleClient.getBooks(language);
    return books.find(book => book.id === bookId) ?? null;
  },

  getStageSummaries: async (bookId: string): Promise<WordPuzzleStageSummary[]> =>
    buildStageSummaries(bookId),

  getArabicStage: async (bookId: string, stageNumber: number): Promise<WordPuzzleStage> => {
    const categoryId = parseArabicBookId(bookId);
    let page = stageNumber;
    let puzzles: ReturnType<typeof mapIslamicQuestionToPuzzle>[] = [];

    while (puzzles.length < WORD_PUZZLE_PUZZLES_PER_STAGE && page <= stageNumber + 8) {
      const {data} = await islamicQuizClient.get<IslamicQuizPagedQuestionsDto>(
        `/categories/${categoryId}/questions`,
        {params: {page, limit: WORD_PUZZLE_FETCH_BATCH}},
      );
      puzzles = [
        ...puzzles,
        ...mapQuestionsToStagePuzzles(data.questions, stageNumber * 100),
      ].slice(0, WORD_PUZZLE_PUZZLES_PER_STAGE);

      if (page >= data.totalPages) {
        break;
      }
      page += 1;
    }

    return buildStageFromPuzzles(
      bookId,
      stageNumber,
      puzzles.filter((item): item is NonNullable<typeof item> => Boolean(item)),
    );
  },

  getEnglishStage: async (bookId: string, stageNumber: number): Promise<WordPuzzleStage> => {
    const category = parseEnglishBookId(bookId);
    const totalNeeded = WORD_PUZZLE_STAGES_PER_BOOK * WORD_PUZZLE_PUZZLES_PER_STAGE;
    const {data} = await englishRiddlesClient.get<EnglishRiddlesBulkDto>(
      `/${category}/${totalNeeded}`,
    );

    const allPuzzles = data.riddlesArray
      .map((riddle, index) => mapEnglishRiddleToPuzzle(riddle, index, category))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    const start = (stageNumber - 1) * WORD_PUZZLE_PUZZLES_PER_STAGE;
    const puzzles = allPuzzles.slice(start, start + WORD_PUZZLE_PUZZLES_PER_STAGE);

    return buildStageFromPuzzles(bookId, stageNumber, puzzles);
  },

  getStage: async (bookId: string, stageNumber: number): Promise<WordPuzzleStage> => {
    if (bookId.startsWith('ar-cat-')) {
      return wordPuzzleClient.getArabicStage(bookId, stageNumber);
    }
    return wordPuzzleClient.getEnglishStage(bookId, stageNumber);
  },

  getStageById: async (bookId: string, stageId: string): Promise<WordPuzzleStage | null> => {
    const match = stageId.match(/-stage-(\d+)$/);
    if (!match) {
      return null;
    }
    return wordPuzzleClient.getStage(bookId, Number(match[1]));
  },
};

export const getStageNumberFromId = (stageId: string) => {
  const match = stageId.match(/-stage-(\d+)$/);
  return match ? Number(match[1]) : 1;
};
