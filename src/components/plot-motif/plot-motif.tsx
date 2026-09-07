import { useMemo } from 'react';
import { classes } from '~/utils/style';
import styles from './plot-motif.module.css';

/**
 * Oversized structural decoration: an axis, its graduations and a plotted
 * series. It sits behind the project previews the way a watermark would,
 * carrying the analytical register of the site without asserting a claim —
 * the series is a fixed shape, not data about anything.
 */
const SERIES = [
  0.26, 0.33, 0.29, 0.42, 0.37, 0.51, 0.46, 0.62, 0.55, 0.69, 0.63, 0.78, 0.72,
  0.87, 0.81, 0.93, 0.88, 0.98,
];

type PlotMotifProps = {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  visible?: boolean;
  [key: `data-${string}`]: unknown;
};

const WIDTH = 751;
const HEIGHT = 136;

export const PlotMotif = ({
  orientation = 'horizontal',
  className,
  visible,
  ...rest
}: PlotMotifProps) => {
  const vertical = orientation === 'vertical';
  // `long` runs along the axis, `across` is the depth of the plot. Both
  // orientations use the same extents — only the projection swaps — so the
  // vertical viewBox is simply the horizontal one transposed.
  const long = WIDTH;
  const across = HEIGHT;

  const { linePath, ticks, nodes, gridLines } = useMemo(() => {
    const baseline = across - 16;
    const span = across - 44;
    const step = long / (SERIES.length - 1);

    // In the vertical orientation the axes swap, so build points in
    // (along, depth) space and project once at the end.
    const project = (along: number, depth: number) =>
      vertical ? [depth, along] : [along, depth];

    const points = SERIES.map((value, index) =>
      project(index * step, baseline - value * span)
    );

    const path = points
      .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(' ');

    const tickMarks = Array.from({ length: 31 }, (_, index) => {
      const along = (index / 30) * long;
      const major = index % 5 === 0;
      const size = major ? 13 : 6;
      const [x1, y1] = project(along, baseline);
      const [x2, y2] = project(along, baseline + size);
      return { x1, y1, x2, y2, major };
    });

    const grid = [0.25, 0.5, 0.75].map(fraction => {
      const depth = baseline - fraction * span;
      const [x1, y1] = project(0, depth);
      const [x2, y2] = project(long, depth);
      return { x1, y1, x2, y2 };
    });

    return {
      linePath: path,
      ticks: tickMarks,
      nodes: points.filter((_, index) => index % 3 === 0),
      gridLines: grid,
    };
  }, [vertical, long, across]);

  const [axisX1, axisY1] = vertical ? [across - 16, 0] : [0, across - 16];
  const [axisX2, axisY2] = vertical ? [across - 16, long] : [long, across - 16];

  return (
    <svg
      aria-hidden
      className={classes(styles.motif, className)}
      data-visible={visible}
      viewBox={vertical ? `0 0 ${HEIGHT} ${WIDTH}` : `0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      {...rest}
    >
      {gridLines.map((line, index) => (
        <line key={`grid-${index}`} className={styles.grid} {...line} />
      ))}
      <line className={styles.axis} x1={axisX1} y1={axisY1} x2={axisX2} y2={axisY2} />
      {ticks.map((tick, index) => (
        <line
          key={`tick-${index}`}
          className={styles.tick}
          data-major={tick.major}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
        />
      ))}
      <path className={styles.series} d={linePath} />
      {nodes.map(([cx, cy], index) => (
        <circle key={`node-${index}`} className={styles.node} cx={cx} cy={cy} r={4} />
      ))}
    </svg>
  );
};
