import { lazy, Suspense } from 'react';
import { Button } from '~/components/button';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { SectionLabel } from '~/components/section-label';
import { Text } from '~/components/text';
import { useTheme } from '~/components/theme';
import { Transition } from '~/components/transition';
import { analyticsProject } from '~/data/profile';
import { cssProps } from '~/utils/style';
import styles from './analytics.module.css';

const ForecastChart = lazy(() =>
  import('~/visuals/forecast-chart').then(m => ({ default: m.ForecastChart }))
);

const STEPS = [
  {
    index: '01',
    label: 'Ingest',
    detail:
      '50K+ e-commerce records across nine relational tables, loaded into PostgreSQL with Python.',
  },
  {
    index: '02',
    label: 'Transform',
    detail: 'SQL transformations into category-level daily revenue datasets.',
  },
  {
    index: '03',
    label: 'Model',
    detail:
      'ARIMA, Prophet and XGBoost under rolling-window validation, compared on forecast accuracy.',
  },
  {
    index: '04',
    label: 'Communicate',
    detail:
      'A Tableau dashboard carrying category performance, demand trends, the forecast and the model results.',
  },
];

/** Four successive train/test splits, each shifted along the series. */
const WINDOWS = [0, 1, 2, 3];

type AnalyticsProps = {
  id: string;
  sectionRef: React.RefObject<HTMLElement>;
  visible: boolean;
};

export function Analytics({ id, sectionRef, visible }: AnalyticsProps) {
  const { theme } = useTheme();
  const inverseTheme = theme === 'dark' ? 'light' : 'dark';
  const titleId = `${id}-title`;

  return (
    // The tokens cascade from `data-theme` alone, so this slab inverts the
    // palette without a nested provider. `data-invert` is what the navbar
    // looks for when deciding to flip its own items against this block.
    <section
      data-theme={inverseTheme}
      data-invert
      className={styles.analytics}
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible} timeout={0}>
        {({ visible: entered }) => (
          <Section className={styles.inner}>
            <div className={styles.content}>
              <header className={styles.header}>
                <SectionLabel index="02" label="Analysis" visible={entered} />
                <Heading
                  level={2}
                  as="h2"
                  id={titleId}
                  className={styles.title}
                  data-visible={entered}
                >
                  <span className={styles.line}>A number is easy.</span>{' '}
                  <span className={styles.line}>A number someone acts on is the work.</span>
                </Heading>
                <Text size="l" as="p" className={styles.lede} data-visible={entered}>
                  Demand planning needs a forecast and a reason to trust it. This project
                  built the database, the transformations and the model comparison behind a
                  60-day category-level revenue forecast — then put the result somewhere a
                  planner could actually use it.
                </Text>
              </header>

              <div className={styles.chart} data-visible={entered}>
                <Suspense fallback={<div className={styles.chartFallback} />}>
                  <ForecastChart visible={entered} />
                </Suspense>
              </div>

              <div className={styles.lower}>
                <ol className={styles.steps}>
                  {STEPS.map((step, index) => (
                    <li
                      key={step.index}
                      className={styles.step}
                      data-visible={entered}
                      style={cssProps({ delay: 600 + index * 120 })}
                    >
                      <span className={styles.stepIndex}>{step.index}</span>
                      <h3 className={styles.stepLabel}>{step.label}</h3>
                      <p className={styles.stepDetail}>{step.detail}</p>
                    </li>
                  ))}
                </ol>

                <div className={styles.validation} data-visible={entered}>
                  <h3 className={styles.validationTitle}>Rolling-window validation</h3>
                  <p className={styles.validationCopy}>
                    Each model is scored on windows it never saw during fitting — which is
                    what makes a comparison between three forecasts mean anything.
                  </p>
                  <svg
                    className={styles.windows}
                    viewBox="0 0 260 92"
                    role="img"
                    aria-label="Four successive train and test splits, each shifted later along the series."
                  >
                    {WINDOWS.map(row => {
                      const y = row * 22 + 6;
                      const trainWidth = 120 + row * 26;
                      return (
                        <g key={row} style={cssProps({ delay: 900 + row * 140 })}>
                          <rect
                            className={styles.train}
                            x={0}
                            y={y}
                            width={trainWidth}
                            height={10}
                          />
                          <rect
                            className={styles.test}
                            x={trainWidth + 4}
                            y={y}
                            width={38}
                            height={10}
                          />
                        </g>
                      );
                    })}
                  </svg>
                  <div className={styles.windowsKey}>
                    <span data-kind="train">Train</span>
                    <span data-kind="test">Held out</span>
                  </div>
                </div>
              </div>

              <div className={styles.action} data-visible={entered}>
                <Button
                  iconHoverShift
                  iconEnd="arrow-right"
                  href={`/projects/${analyticsProject.slug}`}
                >
                  Read the full case study
                </Button>
              </div>
            </div>
          </Section>
        )}
      </Transition>
    </section>
  );
}
