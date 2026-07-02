export type IslamicQuizAnswerDto = {
  answer: string;
  t: number;
};

export type IslamicQuizQuestionDto = {
  id: number;
  q: string;
  link?: string;
  answers: IslamicQuizAnswerDto[];
  category: string;
  topic: string;
};

export type IslamicQuizCategoryDto = {
  id: number;
  arabicName: string;
  englishName: string;
  description?: string;
  topics?: Array<{slug: string; name: string}>;
};

export type IslamicQuizPagedQuestionsDto = {
  page: number;
  limit: number;
  totalQuestions: number;
  totalPages: number;
  questions: IslamicQuizQuestionDto[];
};

export type EnglishRiddleDto = {
  riddle: string;
  answer: string;
};

export type EnglishRiddlesBulkDto = {
  riddlesArray: EnglishRiddleDto[];
  category: string;
};

export type QuranSurahSummaryDto = {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
};
