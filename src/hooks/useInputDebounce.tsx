import {useState, useEffect, useMemo} from 'react';
import {debounce} from 'lodash';

/**
 * Custom hook to debounce a value using lodash.debounce
 * @param value The value to debounce
 * @param delay Debounce delay in milliseconds
 */
export const useDebounce = (value: string | number, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debounced = useMemo(
    () =>
      debounce((val: string | number) => {
        setDebouncedValue(val);
      }, delay),
    [delay],
  );

  useEffect(() => {
    debounced(value);

    // Cleanup the debounce instance when value or delay changes
    return () => {
      debounced.cancel();
    };
  }, [value, debounced]);

  return debouncedValue;
};
