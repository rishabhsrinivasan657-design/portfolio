import { useEffect, useState, type RefObject } from 'react';

/**
 * Reports whether an element is intersecting the viewport. Pass
 * `unobserveOnIntersect` for one-shot reveals so the observer detaches after
 * the first hit and the element never animates back out.
 */
export function useInViewport(
  elementRef: RefObject<Element | null>,
  unobserveOnIntersect = false,
  options: IntersectionObserverInit = {},
  shouldObserve = true
) {
  const [intersect, setIntersect] = useState(false);
  const [isUnobserved, setIsUnobserved] = useState(false);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element || isUnobserved || !shouldObserve) return;

    const observer = new IntersectionObserver(([entry]) => {
      const { isIntersecting, target } = entry;

      setIntersect(isIntersecting);

      if (isIntersecting && unobserveOnIntersect) {
        observer.unobserve(target);
        setIsUnobserved(true);
      }
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef, unobserveOnIntersect, isUnobserved, shouldObserve]);

  return intersect;
}
