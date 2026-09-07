import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Viewport size, with a workaround for iOS Safari reporting the wrong
 * `innerHeight` while the URL bar is collapsing: measure a fixed 100vh
 * element instead.
 */
export function useWindowSize() {
  const dimensions = useRef({ width: 1280, height: 800 });

  const measureWithRuler = useCallback(() => {
    const ruler = document.createElement('div');

    ruler.style.position = 'fixed';
    ruler.style.height = '100vh';
    ruler.style.width = '0';
    ruler.style.top = '0';

    document.documentElement.appendChild(ruler);

    dimensions.current.width = window.innerWidth;
    dimensions.current.height = ruler.offsetHeight;

    document.documentElement.removeChild(ruler);
  }, []);

  const getHeight = useCallback(() => {
    const isIOS = /iphone|ipod|ipad/i.test(navigator?.userAgent ?? '');

    if (isIOS) {
      measureWithRuler();
      return dimensions.current.height;
    }

    return window.innerHeight;
  }, [measureWithRuler]);

  const getSize = useCallback(
    () => ({ width: window.innerWidth, height: getHeight() }),
    [getHeight]
  );

  const [windowSize, setWindowSize] = useState(dimensions.current);

  useEffect(() => {
    const handleResize = () => setWindowSize(getSize());

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [getSize]);

  return windowSize;
}
