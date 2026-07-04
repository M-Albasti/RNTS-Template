import {useQuery} from '@tanstack/react-query';

import {wordPuzzleClient} from '@api/clients/wordPuzzleClient';
import {queryKeys} from '@api/query/queryKeys';
import type {WordPuzzleLanguage} from '@Types/wordPuzzleTypes';

export const useWordPuzzleBooksQuery = (language: WordPuzzleLanguage) =>
  useQuery({
    queryKey: queryKeys.wordPuzzle.books(language),
    queryFn: () => wordPuzzleClient.getBooks(language),
    staleTime: 1000 * 60 * 60 * 12,
  });

export const useWordPuzzleBookQuery = (bookId: string) =>
  useQuery({
    queryKey: queryKeys.wordPuzzle.book(bookId),
    queryFn: () => wordPuzzleClient.getBookSummary(bookId),
    enabled: Boolean(bookId),
    staleTime: 1000 * 60 * 60 * 12,
  });

export const useWordPuzzleStageSummariesQuery = (bookId: string) =>
  useQuery({
    queryKey: queryKeys.wordPuzzle.stageSummaries(bookId),
    queryFn: () => wordPuzzleClient.getStageSummaries(bookId),
    enabled: Boolean(bookId),
    staleTime: 1000 * 60 * 60 * 24,
  });

export const useWordPuzzleStageQuery = (bookId: string, stageId: string) =>
  useQuery({
    queryKey: queryKeys.wordPuzzle.stage(bookId, stageId),
    queryFn: () => wordPuzzleClient.getStageById(bookId, stageId),
    enabled: Boolean(bookId && stageId),
    staleTime: 1000 * 60 * 30,
  });
