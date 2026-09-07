import { useMemo } from 'react';

import styles from './forecast-chart.module.css';

const WIDTH = 900;
const HEIGHT = 336;
const PLOT = { left: 56, right: 872, top: 28, bottom: 286 };
const SPLIT_RATIO = 0.62;

/**
 * A schematic of the forecasting method: history, a split, a forecast and a
 * widening interval. The curve is generated from a fixed formula — it is the
 * *shape* of the analysis, not a measurement, so the axes carry no values.
 */
function seriesValue(t: number) {
  // Trend plus two seasonal components; deterministic, no randomness.
  return (
    0.30 +
    0.42 * t +
    0.085 * Math.sin(t * Math.PI * 6.2) +
    0.045 * Math.sin(t * Math.PI * 15.5 + 1.1)
  );
}

export const ForecastChart = ({ visible }: { visible?: boolean }) => {
  const { historyPath, forecastPath, bandPath, splitX, gridLines, ticks } = useMemo(() => {
    const plotW = PLOT.right - PLOT.left;
    const plotH = PLOT.bottom - PLOT.top;
    const toX = (t: number) => PLOT.left + t * plotW;
    const toY = (v: number) => PLOT.bottom - v * plotH;

    const steps = 120;
    const historyPoints: Array<[number, number]> = [];
    const forecastPoints: Array<[number, number]> = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const point: [number, number] = [toX(t), toY(seriesValue(t))];
      if (t <= SPLIT_RATIO) historyPoints.push(point);
      if (t >= SPLIT_RATIO) forecastPoints.push(point);
    }

    const toPath = (points: Array<[number, number]>) =>
      points
        .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
        .join(' ');

    // The interval fans out with the horizon — the honest shape of forecast
    // uncertainty, and the reason a planner needs the band and not just a line.
    const upper: Array<[number, number]> = [];
    const lower: Array<[number, number]> = [];

    forecastPoints.forEach(([x, y]) => {
      const progress = (x - toX(SPLIT_RATIO)) / (PLOT.right - toX(SPLIT_RATIO));
      const spread = 4 + progress * 42;
      upper.push([x, y - spread]);
      lower.push([x, y + spread]);
    });

    const band = `${toPath(upper)} L ${lower
      .slice()
      .reverse()
      .map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(' L ')} Z`;

    return {
      historyPath: toPath(historyPoints),
      forecastPath: toPath(forecastPoints),
      bandPath: band,
      splitX: toX(SPLIT_RATIO),
      gridLines: [0.25, 0.5, 0.75, 1].map(f => PLOT.bottom - f * plotH),
      ticks: Array.from({ length: 13 }, (_, i) => PLOT.left + (i / 12) * plotW),
    };
  }, []);

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.chart}
        data-visible={visible}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Schematic forecast chart: a historical demand series, a split point, and a projected 60-day forecast with a confidence interval that widens across the horizon."
      >
      {gridLines.map((y, index) => (
        <line
          key={`grid-${index}`}
          className={styles.grid}
          x1={PLOT.left}
          y1={y}
          x2={PLOT.right}
          y2={y}
        />
      ))}

      <line
        className={styles.axis}
        x1={PLOT.left}
        y1={PLOT.bottom}
        x2={PLOT.right}
        y2={PLOT.bottom}
      />
      {ticks.map((x, index) => (
        <line
          key={`tick-${index}`}
          className={styles.tick}
          x1={x}
          y1={PLOT.bottom}
          x2={x}
          y2={PLOT.bottom + (index % 3 === 0 ? 10 : 5)}
        />
      ))}

      {/* Interval, then forecast, then history — painted back to front */}
      <path className={styles.band} d={bandPath} />
      <path className={styles.forecast} d={forecastPath} pathLength={100} />
      <path className={styles.history} d={historyPath} pathLength={100} />

      {/* The split: everything left is observed, everything right is modelled */}
      <line
        className={styles.split}
        x1={splitX}
        y1={PLOT.top - 6}
        x2={splitX}
        y2={PLOT.bottom}
      />
      <circle className={styles.splitDot} cx={splitX} cy={PLOT.bottom} r={4} />

      <text className={styles.splitLabel} x={splitX - 10} y={PLOT.top + 4}>
        OBSERVED
      </text>
      <text className={styles.splitLabelRight} x={splitX + 10} y={PLOT.top + 4}>
        FORECAST · 60 DAYS
      </text>

      <text className={styles.axisLabel} x={PLOT.left} y={PLOT.bottom + 32}>
        HISTORICAL DEMAND
      </text>
      <text className={styles.axisLabelEnd} x={PLOT.right} y={PLOT.bottom + 32}>
        HORIZON
      </text>

      </svg>

      {/* The legend is HTML rather than SVG text: inside the viewBox it would
          scale down with the chart and become unreadable on a phone. */}
      <figcaption className={styles.legend} data-visible={visible}>
        <ul className={styles.keys}>
          <li data-key="history">History</li>
          <li data-key="forecast">Forecast</li>
          <li data-key="interval">Interval</li>
        </ul>
        <span className={styles.caption}>Schematic — method, not measurement</span>
      </figcaption>
    </figure>
  );
};
