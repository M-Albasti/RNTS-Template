import { useState, useEffect } from 'react';

export function useCountdown(start: number, interval = 1000) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (count <= 0) return;

    const id = setInterval(() => {
      setCount((prev) => prev - 1);
    }, interval);

    return () => clearInterval(id);
  }, [count, interval]);

  return count;
}