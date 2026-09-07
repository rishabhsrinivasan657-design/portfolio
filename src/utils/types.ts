import type { HTMLAttributes, SVGAttributes } from 'react';

/**
 * Arbitrary `data-*` attributes. These drive most of the CSS state in the
 * design system, so nearly every component needs to accept them.
 *
 * Note the template-literal key rather than a bare `[key: string]` index
 * signature. A bare string index signature collapses `keyof P` to
 * `string | number`, which makes React's `PropsWithoutRef<P>` evaluate
 * `Omit<P, 'ref'>` and erase every named prop — so `className` and friends
 * silently become `unknown` inside `forwardRef` components.
 */
export type DataAttributes = {
  [key: `data-${string}`]: unknown;
};

/** Base props for components that render an HTML element. */
export type BaseProps<E extends Element = HTMLElement> = HTMLAttributes<E> &
  DataAttributes;

/** Base props for components that render an SVG element. */
export type SvgBaseProps = SVGAttributes<SVGSVGElement> & DataAttributes;
