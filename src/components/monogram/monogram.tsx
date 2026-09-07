import { forwardRef, useId } from 'react';
import { classes } from '~/utils/style';
import type { SvgBaseProps } from '~/utils/types';
import styles from './monogram.module.css';

type MonogramProps = Omit<SvgBaseProps, 'children'> & {
  highlight?: boolean;
};

/**
 * A monoline RS mark. The highlight is a masked duplicate of the strokes —
 * masking rather than clipping means the accent colour can wipe up through
 * the letterforms without distorting the stroke weight.
 */
export const Monogram = forwardRef<SVGSVGElement, MonogramProps>(
  ({ highlight, className, ...props }, ref) => {
    const id = useId();
    const maskId = `${id}monogram-mask`;

    const strokes = (
      <>
        {/* R */}
        <path d="M4 26V2" />
        <path d="M4 2h8c3.5 0 6 2.2 6 6s-2.5 6-6 6H4" />
        <path d="M11.5 14L19 26" />
        {/* S */}
        <path d="M41 7.5C41 4 38 2 34 2s-7 2-7 5.5S30 12.5 34 13.5s7 2.5 7 6-3 6-7 6-7-1.8-7-5.2" />
      </>
    );

    return (
      <svg
        aria-hidden
        className={classes(styles.monogram, className)}
        width="45"
        height="28"
        viewBox="0 0 45 28"
        ref={ref}
        {...props}
      >
        <defs>
          <mask id={maskId}>
            <rect className={styles.maskRect} width="100%" height="100%" fill="#fff" />
          </mask>
        </defs>
        <g className={styles.base}>{strokes}</g>
        {highlight && (
          <g className={styles.highlight} mask={`url(#${maskId})`}>
            {strokes}
          </g>
        )}
      </svg>
    );
  }
);

Monogram.displayName = 'Monogram';
