import { useEffect, useRef } from 'react';

/**
 * setInterval with a callback that can close over fresh state. Pass `reset`
 * to restart the timer when some other value changes.
 */
export function useInterval(callback: () => void, delay: number | null, reset?: unknown) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay, reset]);
}
