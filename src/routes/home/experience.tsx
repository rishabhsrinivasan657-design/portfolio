import { useState } from 'react';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { SectionLabel } from '~/components/section-label';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { experience } from '~/data/profile';
import { cssProps } from '~/utils/style';
import styles from './experience.module.css';

type ExperienceSectionProps = {
  id: string;
  sectionRef: React.RefObject<HTMLElement>;
  visible: boolean;
};

export function ExperienceSection({ id, sectionRef, visible }: ExperienceSectionProps) {
  const [activeId, setActiveId] = useState(experience[0].id);
  const active = experience.find(item => item.id === activeId)!;
  const activeIndex = experience.findIndex(item => item.id === activeId);
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.experience}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible} timeout={0}>
        {({ visible: entered }) => (
          <div className={styles.content}>
            <header className={styles.header}>
              <SectionLabel index="01" label="Experience" visible={entered} />
              <Heading
                level={2}
                as="h2"
                id={titleId}
                className={styles.title}
                data-visible={entered}
              >
                <span className={styles.line}>Four rooms, one job:</span>{' '}
                <span className={styles.line}>turn a question into a system.</span>
              </Heading>
            </header>

            <div className={styles.body}>
              {/* The rail doubles as a timeline — the marker slides to the
                  selected role rather than each item toggling on its own. */}
              <div
                className={styles.rail}
                role="tablist"
                aria-label="Roles"
                style={cssProps({ index: activeIndex, count: experience.length })}
              >
                <div className={styles.railLine} data-visible={entered} />
                <div className={styles.railMarker} aria-hidden />
                {experience.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`${id}-tab-${item.id}`}
                    aria-selected={item.id === activeId}
                    aria-controls={`${id}-panel`}
                    className={styles.railItem}
                    data-active={item.id === activeId}
                    data-visible={entered}
                    style={cssProps({ delay: 500 + index * 90 })}
                    onClick={() => setActiveId(item.id)}
                  >
                    <span className={styles.railIndex}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.railText}>
                      <span className={styles.railCompany}>{item.short}</span>
                      <span className={styles.railPeriod}>{item.period}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div
                className={styles.panel}
                id={`${id}-panel`}
                role="tabpanel"
                aria-labelledby={`${id}-tab-${activeId}`}
                key={activeId}
                data-visible={entered}
              >
                <div className={styles.panelHead}>
                  <Heading level={4} as="h3" className={styles.role}>
                    {active.role}
                  </Heading>
                  <Text size="s" mono className={styles.meta}>
                    {active.company} · {active.location} · {active.period}
                  </Text>
                </div>

                <Text size="l" as="p" className={styles.context}>
                  {active.context}
                </Text>

                <div className={styles.block}>
                  <h4 className={styles.blockLabel}>What I did</h4>
                  <ul className={styles.list}>
                    {active.work.map((item, index) => (
                      <li
                        key={item}
                        className={styles.listItem}
                        style={cssProps({ delay: 120 + index * 70 })}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.blockRow}>
                  <div className={styles.block}>
                    <h4 className={styles.blockLabel}>Methods &amp; tools</h4>
                    <ul className={styles.chips}>
                      {active.stack.map((item, index) => (
                        <li
                          key={item}
                          className={styles.chip}
                          style={cssProps({ delay: 240 + index * 40 })}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.block}>
                    <h4 className={styles.blockLabel}>Result</h4>
                    <dl className={styles.results}>
                      {active.results.map((result, index) => (
                        <div
                          key={result.label}
                          className={styles.result}
                          style={cssProps({ delay: 300 + index * 90 })}
                        >
                          <dt className={styles.resultValue}>{result.value}</dt>
                          <dd className={styles.resultLabel}>{result.label}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
}
