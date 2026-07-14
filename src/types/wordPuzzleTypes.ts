export type WordPuzzleLanguage = 'ar' | 'en';

export type WordPuzzleType =
  | 'image_riddle'
  | 'quran_ayah'
  | 'quran_ayah_count'
  | 'text_riddle';

export type HexCoord = {
  q: number;
  r: number;
};

export type HexLetterCell = HexCoord & {
  id: string;
  letter: string;
  /** Which answer word this cell belongs to; undefined = filler. */
  groupIndex?: number;
};

export type WordPuzzleClue =
  | {
      type: 'image_riddle';
      emojis: string[];
      captionKey?: string;
      text?: string;
    }
  | {
      type: 'quran_ayah';
      textKey?: string;
      text?: string;
    }
  | {
      type: 'quran_ayah_count';
      textKey?: string;
      text?: string;
    }
  | {
      type: 'text_riddle';
      textKey?: string;
      text?: string;
    };

export type WordPuzzleItem = {
  id: string;
  type: WordPuzzleType;
  clue: WordPuzzleClue;
  answers: string[];
  grid: HexLetterCell[];
  solutionPath: HexCoord[];
  sourceUrl?: string;
};

export type WordPuzzleStageSummary = {
  id: string;
  number: number;
  title: string;
};

export type WordPuzzleStage = {
  id: string;
  number: number;
  title: string;
  puzzles: WordPuzzleItem[];
};

export type WordPuzzleBookSummary = {
  id: string;
  language: WordPuzzleLanguage;
  title: string;
  description?: string;
  bookmarkNumber: number;
  stageCount: number;
  source: 'islamicquiz' | 'riddles-api' | 'alquran';
  sourceMeta?: {
    categoryId?: number;
    category?: string;
  };
};

/** @deprecated books are loaded from API summaries */
export type WordPuzzleBook = WordPuzzleBookSummary & {
  landKey?: string;
  titleKey?: string;
  stages?: WordPuzzleStage[];
};

export type WordPuzzleProgress = {
  completedStages: Record<string, string[]>;
  hintsUsed: number;
  gems: number;
};
