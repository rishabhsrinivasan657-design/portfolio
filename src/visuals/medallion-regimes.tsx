import { cssProps } from '~/utils/style';
import styles from './medallion-regimes.module.css';

const SIZE = 560;

function boxPath(x: number, y: number, w: number, h: number, cut = 10) {
  return `M ${x} ${y} H ${x + w} V ${y + h - cut} L ${x + w - cut} ${y + h} H ${x} Z`;
}

const LAYERS = [
  { id: 'bronze', label: 'BRONZE', sub: 'raw ingest', y: 24 },
  { id: 'silver', label: 'SILVER', sub: 'conformed', y: 96 },
  { id: 'gold', label: 'GOLD', sub: '15+ versioned features', y: 168 },
];

/**
 * Fixed intensity ramps. These describe the *shape* of a regime heatmap —
 * four macro dimensions tagged across time — not any specific measurement.
 */
const TRACKS = [
  { label: 'INFLATION', cells: [0.2, 0.3, 0.5, 0.8, 0.9, 0.7, 0.5, 0.35, 0.25, 0.4, 0.6, 0.45] },
  { label: 'GDP', cells: [0.7, 0.75, 0.6, 0.35, 0.2, 0.3, 0.55, 0.7, 0.8, 0.65, 0.5, 0.6] },
  { label: 'FED POLICY', cells: [0.15, 0.2, 0.4, 0.7, 0.95, 0.9, 0.75, 0.5, 0.3, 0.35, 0.45, 0.4] },
  { label: 'YIELD CURVE', cells: [0.6, 0.5, 0.35, 0.2, 0.15, 0.3, 0.5, 0.65, 0.75, 0.6, 0.45, 0.55] },
];

const GRID_X = 168;
const GRID_W = 372;
const COLS = 12;
const CELL_W = GRID_W / COLS;
const ROW_H = 22;
const ROW_GAP = 8;
const GRID_Y = 268;

export const MedallionRegimes = ({ visible }: { visible?: boolean }) => (
  <svg
    className={styles.chart}
    data-visible={visible}
    viewBox={`0 0 ${SIZE} ${SIZE}`}
    role="img"
    aria-label="Schematic of a Databricks medallion pipeline: bronze, silver and gold Delta layers feeding a heatmap of four macroeconomic dimensions tagged across time, resolving into a four-regime classification, with six sector tracks compared beneath."
  >
    {/* ---- Medallion layers ---- */}
    {LAYERS.map((layer, index) => (
      <g
        key={layer.id}
        className={styles.layer}
        data-layer={layer.id}
        style={cssProps({ delay: 150 + index * 150 })}
      >
        <path className={styles.layerBox} d={boxPath(40, layer.y, 480, 52)} />
        <text className={styles.layerLabel} x={58} y={layer.y + 24}>
          {layer.label}
        </text>
        <text className={styles.layerSub} x={58} y={layer.y + 40}>
          {layer.sub}
        </text>
        {/* Delta table glyph: three stacked rows on the right of each layer */}
        {[0, 1, 2].map(row => (
          <rect
            key={row}
            className={styles.tableRow}
            x={420}
            y={layer.y + 14 + row * 9}
            width={82}
            height={5}
          />
        ))}
        {index < LAYERS.length - 1 && (
          <>
            <line
              className={styles.dependency}
              x1={280}
              y1={layer.y + 52}
              x2={280}
              y2={layer.y + 72}
            />
            <path
              className={styles.arrow}
              d={`M 275 ${layer.y + 65} L 280 ${layer.y + 71} L 285 ${layer.y + 65}`}
            />
          </>
        )}
      </g>
    ))}

    <text className={styles.note} x={40} y={244}>
      SCHEDULED DATABRICKS WORKFLOW · DEPENDENCY-ORDERED
    </text>

    {/* ---- Regime heatmap ---- */}
    {TRACKS.map((track, rowIndex) => {
      const y = GRID_Y + rowIndex * (ROW_H + ROW_GAP);
      return (
        <g key={track.label} className={styles.track}>
          <text className={styles.trackLabel} x={40} y={y + 15}>
            {track.label}
          </text>
          {track.cells.map((intensity, colIndex) => (
            <rect
              key={colIndex}
              className={styles.cell}
              x={GRID_X + colIndex * CELL_W + 1}
              y={y}
              width={CELL_W - 2}
              height={ROW_H}
              style={cssProps({
                opacity: intensity,
                delay: 600 + rowIndex * 90 + colIndex * 28,
              })}
            />
          ))}
        </g>
      );
    })}

    {/* ---- Resolved regimes ---- */}
    <g className={styles.regimes} style={cssProps({ delay: 1400 })}>
      <text className={styles.trackLabel} x={40} y={GRID_Y + 4 * (ROW_H + ROW_GAP) + 19}>
        REGIME
      </text>
      {[0, 1, 2, 3].map(index => (
        <g key={index}>
          <rect
            className={styles.regimeBox}
            data-regime={index}
            x={GRID_X + index * (GRID_W / 4) + 1}
            y={GRID_Y + 4 * (ROW_H + ROW_GAP)}
            width={GRID_W / 4 - 2}
            height={26}
            style={cssProps({ delay: 1400 + index * 110 })}
          />
          <text
            className={styles.regimeLabel}
            x={GRID_X + index * (GRID_W / 4) + GRID_W / 8}
            y={GRID_Y + 4 * (ROW_H + ROW_GAP) + 18}
          >
            {String.fromCharCode(65 + index)}
          </text>
        </g>
      ))}
    </g>

    {/* ---- Sector comparison ---- */}
    <g className={styles.sectors} style={cssProps({ delay: 1700 })}>
      <line className={styles.rule} x1={40} y1={452} x2={520} y2={452} />
      <text className={styles.note} x={40} y={474}>
        SIX SECTORS COMPARED ACROSS EVERY REGIME
      </text>
      {Array.from({ length: 6 }, (_, index) => {
        const y = 494 + index * 11;
        return (
          <g key={index}>
            <text className={styles.sectorLabel} x={40} y={y + 4}>
              {String(index + 1).padStart(2, '0')}
            </text>
            <line
              className={styles.sectorTrack}
              pathLength={100}
              x1={GRID_X}
              y1={y}
              x2={520}
              y2={y}
              style={cssProps({ delay: 1750 + index * 90 })}
            />
          </g>
        );
      })}
    </g>
  </svg>
);
