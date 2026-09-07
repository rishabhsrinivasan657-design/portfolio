import { useMemo } from 'react';
import { classes, cssProps } from '~/utils/style';
import styles from './agent-graph.module.css';

const SIZE = 560;
const CENTER = SIZE / 2;
const RADIUS = 176;
const AGENT_COUNT = 9;

/**
 * Only the roles the résumé actually names are labelled. The remaining nodes
 * stay numbered — the system had nine agents, but inventing names for the
 * other five would be making things up.
 */
const NAMED: Record<number, string> = {
  0: 'Portfolio',
  2: 'Risk',
  5: 'Compliance',
  7: 'Evaluation',
};

const EVALUATION_INDEX = 7;

export const AgentGraph = ({ visible }: { visible?: boolean }) => {
  const nodes = useMemo(
    () =>
      Array.from({ length: AGENT_COUNT }, (_, index) => {
        const angle = (index / AGENT_COUNT) * Math.PI * 2 - Math.PI / 2;
        return {
          index,
          x: CENTER + Math.cos(angle) * RADIUS,
          y: CENTER + Math.sin(angle) * RADIUS,
          label: NAMED[index],
          isEvaluation: index === EVALUATION_INDEX,
        };
      }),
    []
  );

  return (
    <svg
      className={classes(styles.graph)}
      data-visible={visible}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label="Schematic of a nine-agent system: an orchestrator coordinating nine agents, grounded by a FAISS vector store and live market data, with an evaluation agent feeding results back to the orchestrator."
    >
      {/* Reference rings — the coordinate scaffolding the graph sits on */}
      <circle className={styles.ring} cx={CENTER} cy={CENTER} r={RADIUS} />
      <circle className={styles.ringInner} cx={CENTER} cy={CENTER} r={RADIUS * 0.55} />

      {/* Orchestrator to each agent */}
      {nodes.map(node => (
        <g key={`edge-${node.index}`}>
          <line
            className={styles.edge}
            x1={CENTER}
            y1={CENTER}
            x2={node.x}
            y2={node.y}
            style={cssProps({ delay: 300 + node.index * 60 })}
          />
          <line
            className={styles.pulse}
            data-evaluation={node.isEvaluation}
            pathLength={100}
            x1={CENTER}
            y1={CENTER}
            x2={node.x}
            y2={node.y}
            style={cssProps({ delay: 900 + node.index * 220 })}
          />
        </g>
      ))}

      {/* Agent nodes */}
      {nodes.map(node => (
        <g
          key={`node-${node.index}`}
          className={styles.node}
          data-evaluation={node.isEvaluation}
          style={cssProps({ delay: 700 + node.index * 70 })}
        >
          <circle className={styles.nodeHalo} cx={node.x} cy={node.y} r={22} />
          <circle className={styles.nodeDot} cx={node.x} cy={node.y} r={13} />
          <text className={styles.nodeIndex} x={node.x} y={node.y + 4}>
            {String(node.index + 1).padStart(2, '0')}
          </text>
          {node.label && (
            <text
              className={styles.nodeLabel}
              x={node.x}
              y={node.y - 32}
              data-evaluation={node.isEvaluation}
            >
              {node.label}
            </text>
          )}
        </g>
      ))}

      {/* Evaluation feedback loop: the critic writes back to the orchestrator */}
      <path
        className={styles.feedback}
        pathLength={100}
        d={`M ${nodes[EVALUATION_INDEX].x} ${nodes[EVALUATION_INDEX].y}
            C ${CENTER - 150} ${CENTER + 90}, ${CENTER - 120} ${CENTER - 60}, ${CENTER - 52} ${CENTER}`}
      />

      {/* Orchestrator */}
      <g className={styles.core} style={cssProps({ delay: 200 })}>
        {/* Drawn as a path rather than a clipped rect: clip-path percentages
            resolve against an inconsistent reference box on SVG elements. */}
        <path
          className={styles.coreBox}
          d={`M ${CENTER - 74} ${CENTER - 26}
              H ${CENTER + 74}
              V ${CENTER + 16}
              L ${CENTER + 64} ${CENTER + 26}
              H ${CENTER - 74} Z`}
        />
        <text className={styles.coreLabel} x={CENTER} y={CENTER - 3}>
          ORCHESTRATOR
        </text>
        <text className={styles.coreSub} x={CENTER} y={CENTER + 14}>
          Google ADK
        </text>
      </g>

      {/* Grounding sources */}
      <g className={styles.source} style={cssProps({ delay: 1100 })}>
        <line className={styles.sourceEdge} x1={62} y1={512} x2={CENTER - 40} y2={CENTER + 30} />
        <rect className={styles.sourceBox} x={8} y={498} width={108} height={30} />
        <text className={styles.sourceLabel} x={62} y={517}>
          FAISS · RAG
        </text>
      </g>
      <g className={styles.source} style={cssProps({ delay: 1250 })}>
        <line
          className={styles.sourceEdge}
          x1={SIZE - 62}
          y1={512}
          x2={CENTER + 40}
          y2={CENTER + 30}
        />
        <rect className={styles.sourceBox} x={SIZE - 116} y={498} width={108} height={30} />
        <text className={styles.sourceLabel} x={SIZE - 62} y={517}>
          LIVE MARKET
        </text>
      </g>
    </svg>
  );
};
