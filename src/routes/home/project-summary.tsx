import { lazy, Suspense, useState } from 'react';
import { Button } from '~/components/button';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { PlotMotif } from '~/components/plot-motif';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import type { Project } from '~/data/profile';
import { useWindowSize } from '~/hooks';
import { cssProps, media } from '~/utils/style';
import styles from './project-summary.module.css';

const AgentGraph = lazy(() =>
  import('~/visuals/agent-graph').then(m => ({ default: m.AgentGraph }))
);
const MedPipeline = lazy(() =>
  import('~/visuals/med-pipeline').then(m => ({ default: m.MedPipeline }))
);
const MedallionRegimes = lazy(() =>
  import('~/visuals/medallion-regimes').then(m => ({ default: m.MedallionRegimes }))
);
const ProjectFilm = lazy(() =>
  import('~/visuals/project-film').then(m => ({ default: m.ProjectFilm }))
);

const VISUALS: Record<string, React.LazyExoticComponent<(props: { visible?: boolean }) => JSX.Element>> = {
  'agentic-advisory': AgentGraph,
  medbuddy: MedPipeline,
  'market-regime': MedallionRegimes,
};

type ProjectSummaryProps = {
  id: string;
  visible: boolean;
  sectionRef: React.RefObject<HTMLElement>;
  index: number;
  project: Project;
  alternate?: boolean;
};

/**
 * A full-viewport project staging: metadata and copy on one side, an
 * animated schematic of the system on the other. The schematic is drawn from
 * the project's own architecture — there are no screenshots to fake. A
 * project with a real interface shows its rendered product film instead.
 */
export function ProjectSummary({
  id,
  visible: sectionVisible,
  sectionRef,
  index,
  project,
  alternate,
  ...rest
}: ProjectSummaryProps) {
  const [focused, setFocused] = useState(false);
  const { width } = useWindowSize();
  const titleId = `${id}-title`;
  const isMobile = width <= media.tablet;
  const indexText = index < 10 ? `0${index}` : String(index);
  const Visual = VISUALS[project.id];

  function renderDetails(visible: boolean) {
    return (
      <div className={styles.details}>
        <div aria-hidden className={styles.index}>
          <Divider
            notchWidth="64px"
            notchHeight="8px"
            collapsed={!visible}
            collapseDelay={1000}
          />
          <span className={styles.indexNumber} data-visible={visible}>
            {indexText}
          </span>
        </div>
        <Heading
          level={3}
          as="h2"
          className={styles.title}
          data-visible={visible}
          id={titleId}
        >
          {project.title}
        </Heading>
        <Text className={styles.description} data-visible={visible} as="p" size="l">
          {project.summary}
        </Text>
        <ul className={styles.metrics} data-visible={visible} aria-label="Key figures">
          {project.metrics.map((metric, metricIndex) => (
            <li
              key={metric.label}
              className={styles.metric}
              style={cssProps({ delay: 900 + metricIndex * 120 })}
            >
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </li>
          ))}
        </ul>
        <div className={styles.button} data-visible={visible}>
          <Button iconHoverShift href={`/projects/${project.slug}`} iconEnd="arrow-right">
            Read the case study
          </Button>
        </div>
      </div>
    );
  }

  function renderPreview(visible: boolean) {
    return (
      <div className={styles.preview}>
        <PlotMotif
          className={styles.motif}
          orientation="horizontal"
          visible={visible}
          data-alternate={alternate}
        />
        <div className={styles.visual} data-visible={visible} data-film={Boolean(project.film)}>
          <div className={styles.visualFrame}>
            <div className={styles.visualMeta} aria-hidden>
              <span>{project.venue}</span>
              <span>{project.period}</span>
            </div>
            {project.film && (
              <Suspense fallback={<div className={styles.filmFallback} />}>
                <ProjectFilm film={project.film} visible={visible} />
              </Suspense>
            )}
            {!project.film && Visual && (
              <Suspense fallback={<div className={styles.visualFallback} />}>
                <Visual visible={visible} />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Section
      className={styles.summary}
      data-alternate={alternate}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      aria-labelledby={titleId}
      ref={sectionRef}
      id={id}
      tabIndex={-1}
      {...rest}
    >
      <div className={styles.content}>
        <Transition in={sectionVisible || focused}>
          {({ visible }) => (
            <>
              {!alternate && !isMobile && (
                <>
                  {renderDetails(visible)}
                  {renderPreview(visible)}
                </>
              )}
              {(alternate || isMobile) && (
                <>
                  {renderPreview(visible)}
                  {renderDetails(visible)}
                </>
              )}
            </>
          )}
        </Transition>
      </div>
    </Section>
  );
}
