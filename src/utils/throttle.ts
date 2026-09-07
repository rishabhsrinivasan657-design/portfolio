export function throttle<Args extends unknown[]>(
  func: (...args: Args) => void,
  timeFrame: number
) {
  let lastTime = 0;

  return function (...args: Args) {
    const now = Date.now();

    if (now - lastTime >= timeFrame) {
      func(...args);
      lastTime = now;
    }
  };
}
