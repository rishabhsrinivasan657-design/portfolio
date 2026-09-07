import { cssProps } from '~/utils/style';
import styles from './med-pipeline.module.css';

const SIZE = 560;

/** A chamfered box, drawn as a path so the cut corner survives scaling. */
function boxPath(x: number, y: number, w: number, h: number, cut = 10) {
  return `M ${x} ${y} H ${x + w} V ${y + h - cut} L ${x + w - cut} ${y + h} H ${x} Z`;
}

const STAGES = [
  { id: 'image', y: 30, h: 52, label: 'PRESCRIPTION IMAGE', sub: 'unstructured input' },
  { id: 'vision', y: 126, h: 52, label: 'GEMINI VISION', sub: 'extraction' },
  { id: 'record', y: 222, h: 96, label: 'STRUCTURED RECORD', sub: null },
  { id: 'check', y: 364, h: 52, label: 'INTERACTION CHECK', sub: 'RAG over FDA data' },
];

/** Generic prescription fields, shown as empty rows — no invented values. */
const RECORD_FIELDS = ['DRUG', 'DOSE', 'SCHEDULE'];

const FLOW_X = 190;
const BOX_X = 40;
const BOX_W = 300;

export const MedPipeline = ({ visible }: { visible?: boolean }) => (
  <svg
    className={styles.pipeline}
    data-visible={visible}
    viewBox={`0 0 ${SIZE} ${SIZE}`}
    role="img"
    aria-label="Schematic of the MedBuddy pipeline: a prescription image is read by Gemini Vision into a structured record, which is checked for drug interactions using retrieval-augmented generation over FDA datasets, producing tracked and flagged outcomes."
  >
    {/* Connectors between stages, with a travelling pulse on each */}
    {STAGES.slice(0, -1).map((stage, index) => {
      const from = stage.y + stage.h;
      const to = STAGES[index + 1].y;
      return (
        <g key={`link-${stage.id}`}>
          <line className={styles.link} x1={FLOW_X} y1={from} x2={FLOW_X} y2={to} />
          <line
            className={styles.pulse}
            pathLength={100}
            x1={FLOW_X}
            y1={from}
            x2={FLOW_X}
            y2={to}
            style={cssProps({ delay: 800 + index * 320 })}
          />
          <path
            className={styles.arrow}
            d={`M ${FLOW_X - 5} ${to - 8} L ${FLOW_X} ${to - 1} L ${FLOW_X + 5} ${to - 8}`}
          />
        </g>
      );
    })}

    {/* Stages */}
    {STAGES.map((stage, index) => (
      <g
        key={stage.id}
        className={styles.stage}
        data-emphasis={stage.id === 'check'}
        style={cssProps({ delay: 200 + index * 140 })}
      >
        <path className={styles.stageBox} d={boxPath(BOX_X, stage.y, BOX_W, stage.h)} />
        <text className={styles.stageIndex} x={BOX_X + 14} y={stage.y + 22}>
          {String(index + 1).padStart(2, '0')}
        </text>
        <text className={styles.stageLabel} x={BOX_X + 44} y={stage.y + 22}>
          {stage.label}
        </text>
        {stage.sub && (
          <text className={styles.stageSub} x={BOX_X + 44} y={stage.y + 38}>
            {stage.sub}
          </text>
        )}

        {stage.id === 'record' &&
          RECORD_FIELDS.map((field, fieldIndex) => (
            <g key={field} style={cssProps({ delay: 900 + fieldIndex * 120 })}>
              <text
                className={styles.fieldLabel}
                x={BOX_X + 44}
                y={stage.y + 52 + fieldIndex * 18}
              >
                {field}
              </text>
              <rect
                className={styles.fieldBar}
                x={BOX_X + 118}
                y={stage.y + 44 + fieldIndex * 18}
                width={150 - fieldIndex * 34}
                height={7}
              />
            </g>
          ))}
      </g>
    ))}

    {/* FDA retrieval source feeding the interaction check */}
    <g className={styles.source} style={cssProps({ delay: 1000 })}>
      <path className={styles.sourceBox} d={boxPath(392, 356, 150, 52, 8)} />
      <text className={styles.sourceLabel} x={404} y={378}>
        FDA DATASETS
      </text>
      <text className={styles.sourceSub} x={404} y={394}>
        vector retrieval
      </text>
      <line className={styles.sourceEdge} x1={392} y1={390} x2={BOX_X + BOX_W} y2={390} />
    </g>

    {/* Outcomes */}
    <g className={styles.outcomes} style={cssProps({ delay: 1300 })}>
      {/* A fork, drawn as one path — three separate lines crossing a bracket
          read as an empty rectangle instead of a split. */}
      <path
        className={styles.fork}
        d="M 190 416 V 432 M 110 432 H 270 M 110 432 V 452 M 270 432 V 452"
      />
      <path className={styles.outcomeBox} d={boxPath(40, 452, 140, 40, 8)} />
      <text className={styles.outcomeLabel} x={54} y={477}>
        ADHERENCE
      </text>
      <path
        className={styles.outcomeBox}
        data-flag
        d={boxPath(200, 452, 140, 40, 8)}
      />
      <text className={styles.outcomeLabel} data-flag x={214} y={477}>
        INTERACTION
      </text>
    </g>

    {/* The engineering underneath */}
    <g className={styles.stack} style={cssProps({ delay: 1500 })}>
      <line className={styles.stackRule} x1={40} y1={518} x2={542} y2={518} />
      {['REACT + TS', 'SPRING BOOT', 'POSTGRESQL', 'DOCKER CI', 'JWT'].map(
        (item, index) => (
          <text key={item} className={styles.stackLabel} x={40 + index * 101} y={538}>
            {item}
          </text>
        )
      )}
    </g>
  </svg>
);
