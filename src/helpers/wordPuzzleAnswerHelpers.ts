import type {WordPuzzleLanguage} from '@Types/wordPuzzleTypes';

import {normalizeWord} from './hexGridHelpers';

const stripForLength = (value: string) =>
  value
    .replace(/[\s\u064B-\u065F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[^\u0600-\u06FFa-zA-Z]/g, '');

export const pickSpellableAnswer = (
  rawAnswer: string,
  language: WordPuzzleLanguage,
): string | null => {
  const candidates = [
    rawAnswer.trim(),
    ...rawAnswer.split(/\s+/).filter(Boolean),
  ];

  for (const candidate of candidates) {
    const compact = stripForLength(candidate);
    if (language === 'en') {
      if (/^[a-zA-Z]{2,15}$/.test(compact)) {
        return compact;
      }
      continue;
    }
    if (compact.length >= 2 && compact.length <= 12 && /[\u0600-\u06FF]/.test(compact)) {
      return compact;
    }
  }

  return null;
};

export const buildAnswerVariants = (answer: string, language: WordPuzzleLanguage) => {
  const normalized = normalizeWord(answer, language);
  const variants = new Set([answer.trim(), normalized]);
  if (language === 'ar') {
    variants.add(answer.replace(/\s+/g, ''));
  }
  return Array.from(variants).filter(Boolean);
};
