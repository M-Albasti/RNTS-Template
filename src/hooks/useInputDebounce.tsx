import React, {useState, useEffect} from 'react';

/**
 * Custom hook to debounce a value or function.
 * @param value The value to debounce (e.g., input text, search query)
 * @param delay Time in milliseconds to wait before updating the value
 */
export const useDebounce = (value: string | number, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timer if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
