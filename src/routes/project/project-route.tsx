import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { Button } from '~/components/button';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { PlotMotif } from '~/components/plot-motif';
import { Section } from '~/components/section';
import { SectionLabel } from '~/components/section-label';
import { Text } from '~/components/text';
import { useTheme } from '~/components/theme';
import { getProjectBySlug, projects } from '~/data/profile';
import { useInViewport } from '~/hooks';
import { cssProps } from '~/utils/style';
import styles from './project-route.module.css';

const AgentGraph = lazy(() =>
  import('~/visuals/agent-graph').then(m => ({ default: m.AgentGraph }))
);
const MedPipeline = lazy(() =>
  import('~/visuals/med-pipeline').then(m => ({ default: m.MedPipeline }))
);
const MedallionRegimes = lazy(() =>
  import('~/visuals/medallion-regimes').then(m => ({ default: m.MedallionRegimes }))
);
const ForecastChart = lazy(() =>
  import('~/visuals/forecast-chart').then(m => ({ default: m.ForecastChart }))
);
const ProjectFilm = lazy(() =>
  import('~/visuals/project-film').then(m => ({ default: m.ProjectFilm }))
);

const VISUALS: Record<
  string,
  { Component: React.LazyExoticComponent<(p: { visible?: boolean }) => JSX.Element>; wide?: boolean }
> = {
  'agentic-advisory': { Component: AgentGraph },
  medbuddy: { Component: MedPipeline },
  'market-regime': { Component: MedallionRegimes },
  'demand-forecasting': { Component: ForecastChart, wide: true },
};

/** Reveals its children once, the first time they scroll into view. */
function Reveal({
  children,
  className,
  as: Component = 'div',
}: {
  children: (visible: boolean) => React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(ref, true, { rootMargin: '0px 0px -12% 0px' });

  return (
    <Component className={className} ref={ref}>
      {children(inViewport)}
    </Component>
  );
}

export const ProjectRoute = () => {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const { theme } = useTheme();
  const inverseTheme = theme === 'dark' ? 'light' : 'dark';
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    if (!project) return;
    document.title = `${project.title} — Rishabh Srinivasan`;
    const timeout = window.setTimeout(() => setHeroVisible(true), 100);
    return () => window.clearTimeout(timeout);
  }, [project]);

  if (!project) return <Navigate to="/" replace />;

  const visual = VISUALS[project.id];
  const Visual = visual?.Component;
  const nextProject =
    projects[(projects.findIndex(item => item.id === project.id) + 1) % projects.length];

  return (
    <article className={styles.project}>
      {/* ---- Header ---- */}
      <Section as="header" className={styles.header}>
        <div className={styles.headerContent} style={cssProps({ initDelay: 300 })}>
          <div className={styles.headerMain}>
            <Text size="s" mono className={styles.venue}>
              {project.venue} · {project.period}
            </Text>
            <Heading level={1} as="h1" className={styles.title}>
              {project.title}
            </Heading>
            <Text size="xl" as="p" className={styles.summary}>
              {project.summary}
            </Text>
            <div className={styles.headerActions}>
              <Button secondary iconHoverShift icon="arrow-left" href="/#project-1">
                All work
              </Button>
              {project.repo && (
                <Button
                  secondary
                  icon="github"
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View the code
                </Button>
              )}
            </div>
          </div>

          <ul className={styles.meta} aria-label="Figures">
            {project.metrics.map((metric, index) => (
              <li
                className={styles.metaItem}
                style={cssProps({ delay: 600 + index * 140 })}
                key={metric.label}
              >
                <span className={styles.metaValue}>{metric.value}</span>
                <span className={styles.metaLabel}>{metric.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---- Hero schematic ---- */}
      <Section className={styles.heroSection}>
        <div
          className={styles.hero}
          data-wide={Boolean(project.film) || visual?.wide}
          data-visible={heroVisible}
        >
          <PlotMotif className={styles.heroMotif} visible={heroVisible} />
          <div className={styles.heroFrame}>
            <div className={styles.heroMeta} aria-hidden>
              <span>{project.film ? 'Product film' : 'System schematic'}</span>
              <span>{project.index}</span>
            </div>
            {project.film && (
              <Suspense fallback={<div className={styles.heroFilmFallback} />}>
                <ProjectFilm film={project.film} visible={heroVisible} />
              </Suspense>
            )}
            {!project.film && Visual && (
              <Suspense fallback={<div className={styles.heroFallback} />}>
                <Visual visible={heroVisible} />
              </Suspense>
            )}
          </div>
        </div>
      </Section>

      {/* ---- Problem ---- */}
      <Reveal as="section" className={styles.block}>
        {visible => (
          <Section className={styles.blockInner}>
            <div className={styles.narrow}>
              <SectionLabel index="01" label="The problem" visible={visible} />
              <Text size="xl" as="p" className={styles.statement} data-visible={visible}>
                {project.problem}
              </Text>
            </div>
          </Section>
        )}
      </Reveal>

      {/* ---- Approach ---- */}
      <Reveal as="section" className={styles.block}>
        {visible => (
          <Section className={styles.blockInner}>
            <div className={styles.wide}>
              <SectionLabel index="02" label="Approach" visible={visible} />
              <ol className={styles.steps}>
                {project.approach.map((item, index) => (
                  <li
                    key={item}
                    className={styles.step}
                    data-visible={visible}
                    style={cssProps({ delay: 200 + index * 140 })}
                  >
                    <span className={styles.stepIndex}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className={styles.stepText}>{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Section>
        )}
      </Reveal>

      {/* ---- Build (inverted slab) ---- */}
      <Reveal as="section" className={styles.blockInverted}>
        {visible => (
          <div data-theme={inverseTheme} data-invert className={styles.invertedInner}>
            <Section className={styles.blockInner}>
              <div className={styles.buildGrid}>
                <div>
                  <SectionLabel index="03" label="What it was built with" visible={visible} />
                  <ul className={styles.buildList}>
                    {project.build.map((item, index) => (
                      <li
                        key={item}
                        className={styles.buildItem}
                        data-visible={visible}
                        style={cssProps({ delay: 200 + index * 110 })}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className={styles.stack} aria-label="Technologies">
                  {project.stack.map((item, index) => (
                    <li
                      key={item}
                      className={styles.stackItem}
                      data-visible={visible}
                      style={cssProps({ delay: 300 + index * 60 })}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Section>
          </div>
        )}
      </Reveal>

      {/* ---- Result ---- */}
      <Reveal as="section" className={styles.block}>
        {visible => (
          <Section className={styles.blockInner}>
            <div className={styles.wide}>
              <SectionLabel index="04" label="Result" visible={visible} />
              <ul className={styles.resultList}>
                {project.result.map((item, index) => (
                  <li
                    key={item}
                    className={styles.resultItem}
                    data-visible={visible}
                    style={cssProps({ delay: 200 + index * 140 })}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        )}
      </Reveal>

      {/* ---- Why it matters ---- */}
      <Reveal as="section" className={styles.block}>
        {visible => (
          <Section className={styles.blockInner}>
            <div className={styles.narrow}>
              <SectionLabel index="05" label="Why it matters" visible={visible} />
              <blockquote className={styles.quote} data-visible={visible}>
                {project.matters}
              </blockquote>
            </div>
          </Section>
        )}
      </Reveal>

      {/* ---- Next ---- */}
      <Reveal as="section" className={styles.next}>
        {visible => (
          <Section className={styles.blockInner}>
            <RouterLink
              className={styles.nextLink}
              to={`/projects/${nextProject.slug}`}
              data-visible={visible}
            >
              <span className={styles.nextLabel}>Next project</span>
              <span className={styles.nextTitle}>{nextProject.title}</span>
            </RouterLink>
          </Section>
        )}
      </Reveal>

      <Footer />
    </article>
  );
};
