import { useReducedMotion } from 'framer-motion';
import { useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Smooth-scrolls to an in-page anchor and only writes the hash to the URL
 * once scrolling has settled, so the browser never fights the animation.
 */
export function useScrollToHash() {
  const scrollTimeout = useRef<number>();
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return useCallback(
    (hash: string, onDone?: () => void) => {
      const id = hash.split('#')[1];
      const targetElement = document.getElementById(id);

      if (!targetElement) return;

      targetElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

      const handleScroll = () => {
        window.clearTimeout(scrollTimeout.current);

        scrollTimeout.current = window.setTimeout(() => {
          window.removeEventListener('scroll', handleScroll);

          if (window.location.pathname === location.pathname) {
            onDone?.();
            navigate(`${location.pathname}#${id}`, { replace: true, preventScrollReset: true });
          }
        }, 50);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.clearTimeout(scrollTimeout.current);
      };
    },
    [navigate, reduceMotion, location.pathname]
  );
}
