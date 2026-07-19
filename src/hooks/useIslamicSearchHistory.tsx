import {useCallback, useState} from 'react';

import {
  clearSearchHistory,
  loadSearchHistory,
  persistSearchQuery,
  removeSearchHistoryEntry,
  type IslamicSearchHistoryEntry,
  type IslamicSearchHistoryScope,
} from '@helpers/islamicSearchHelpers';

export const useIslamicSearchHistory = () => {
  const [history, setHistory] = useState<IslamicSearchHistoryEntry[]>(() =>
    loadSearchHistory(),
  );

  const add = useCallback((query: string, scope?: IslamicSearchHistoryScope) => {
    setHistory(persistSearchQuery(query, scope));
  }, []);

  const clear = useCallback(() => {
    clearSearchHistory();
    setHistory([]);
  }, []);

  const remove = useCallback((query: string) => {
    setHistory(removeSearchHistoryEntry(query));
  }, []);

  return {
    history,
    recentQueries: history.map(item => item.query),
    add,
    clear,
    remove,
  };
};
