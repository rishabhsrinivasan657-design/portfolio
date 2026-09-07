import { useReducedMotion } from 'framer-motion';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { DecoderText } from '~/components/decoder-text';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { useTheme } from '~/components/theme';
import { tokens } from '~/components/theme/theme';
import { Transition } from '~/components/transition';
import { VisuallyHidden } from '~/components/visually-hidden';
import config from '~/config';
import { useHasMounted, useInterval, usePrevious, useScrollToHash } from '~/hooks';
import { cssProps } from '~/utils/style';
import styles from './intro.module.css';

const Field = lazy(() => import('./field').then(module => ({ default: module.Field })));

type IntroProps = {
  id: string;
  sectionRef: React.RefObject<HTMLElement>;
  scrollIndicatorHidden: boolean;
};

export function Intro({ id, sectionRef, scrollIndicatorHidden, ...rest }: IntroProps) {
  const { theme } = useTheme();
  const { disciplines } = config;
  const [disciplineIndex, setDisciplineIndex] = useState(0);
  const prevTheme = usePrevious(theme);
  const introLabel = [
    disciplines.slice(0, -1).join(', '),
    disciplines.slice(-1)[0],
  ].join(', and ');
  const currentDiscipline = disciplines[disciplineIndex];
  const titleId = `${id}-title`;
  const scrollToHash = useScrollToHash();
  const hasMounted = useHasMounted();
  const reduceMotion = useReducedMotion();

  // Auto-rotating text is the case WCAG 2.2.2 is written for, so the cycle
  // stops entirely when reduced motion is requested. The visually hidden
  // label still names every discipline.
  useInterval(
    () => setDisciplineIndex(index => (index + 1) % disciplines.length),
    reduceMotion ? null : 5000,
    theme
  );

  useEffect(() => {
    if (prevTheme && prevTheme !== theme) setDisciplineIndex(0);
  }, [theme, prevTheme]);

  const handleScrollClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToHash(event.currentTarget.href);
  };

  return (
    <Section
      className={styles.intro}
      as="section"
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >
      <Transition in key={theme} timeout={3000}>
        {({ visible, status }) => (
          <>
            {hasMounted && (
              <Suspense fallback={null}>
                <Field />
              </Suspense>
            )}
            <header className={styles.text}>
              <h1 className={styles.name} data-visible={visible} id={titleId}>
                <DecoderText text={config.name} delay={500} />
              </h1>
              <Heading level={0} as="h2" className={styles.title}>
                <VisuallyHidden className={styles.label}>
                  {`${config.role} + ${introLabel}`}
                </VisuallyHidden>
                <span aria-hidden className={styles.row}>
                  <span
                    className={styles.word}
                    data-status={status}
                    style={cssProps({ delay: tokens.base.durationXS })}
                  >
                    {config.role}
                  </span>
                  <span className={styles.line} data-status={status} />
                </span>
                <div className={styles.row}>
                  {disciplines.map(item => (
                    <Transition
                      unmount
                      in={item === currentDiscipline}
                      timeout={{ enter: 3000, exit: 2000 }}
                      key={item}
                    >
                      {({ status: wordStatus, nodeRef }) => (
                        <span
                          aria-hidden
                          ref={nodeRef as React.RefObject<HTMLSpanElement>}
                          className={styles.word}
                          data-plus
                          data-status={wordStatus}
                          style={cssProps({ delay: tokens.base.durationL })}
                        >
                          {item}
                        </span>
                      )}
                    </Transition>
                  ))}
                </div>
              </Heading>

              {/* Structured metadata, in the register of a chart's axis
                  labels rather than a subtitle. */}
              <dl className={styles.meta} data-status={status} aria-label="Profile summary">
                <div className={styles.metaItem}>
                  <dt>Reading</dt>
                  <dd>M.S. Information Systems &amp; AI</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>At</dt>
                  <dd>University of Maryland</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Position</dt>
                  <dd>{config.coordinates}</dd>
                </div>
              </dl>
            </header>

            <RouterLink
              to="/#experience"
              className={styles.scrollIndicator}
              data-status={status}
              data-hidden={scrollIndicatorHidden}
              onClick={handleScrollClick}
            >
              <VisuallyHidden>Scroll to experience</VisuallyHidden>
            </RouterLink>
            <RouterLink
              to="/#experience"
              className={styles.mobileScrollIndicator}
              data-status={status}
              data-hidden={scrollIndicatorHidden}
              onClick={handleScrollClick}
            >
              <VisuallyHidden>Scroll to experience</VisuallyHidden>
              <svg
                aria-hidden
                stroke="currentColor"
                width="43"
                height="15"
                viewBox="0 0 43 15"
              >
                <path d="M1 1l20.5 12L42 1" strokeWidth="2" fill="none" />
              </svg>
            </RouterLink>
          </>
        )}
      </Transition>
    </Section>
  );
}
