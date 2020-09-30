import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

export interface FuzzyClient<T> {
  keyword: string;
  result: T[];
  resetSearch: () => void;
  search: (keyword: string) => void;
}

export function useSearch<T>(
  data: T[],
  options?: Fuse.FuseSearchOptions,
): FuzzyClient<T> {
  const [keyword, setKeyword] = useState('');
  const resetSearch = (): void => setKeyword('');

  const searcher = useMemo(() => {
    const defaultOptions = {
      shouldSort: true,
      threshold: 0.5,
      location: 0,
      distance: 50,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['group', 'title', 'keywords'],
    };
    return new Fuse(data, { ...defaultOptions, ...(options || {}) });
  }, [data, options]);
  const result = keyword
    ? searcher.search(keyword).map((resultItem) => ({
        ...resultItem.item,
        index: resultItem.refIndex,
      }))
    : data;

  return {
    keyword,
    resetSearch,
    result,
    search: setKeyword,
  };
}
