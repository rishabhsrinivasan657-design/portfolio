import { Heading } from '~/components/heading';
import { Icon } from '~/components/icon';
import { Section } from '~/components/section';
import { SectionLabel } from '~/components/section-label';
import { Transition } from '~/components/transition';
import config from '~/config';
import { additionalWork } from '~/data/profile';
import { cssProps } from '~/utils/style';
import styles from './more-work.module.css';

type MoreWorkProps = {
  id: string;
  sectionRef: React.RefObject<HTMLElement>;
  visible: boolean;
};

/**
 * The remaining projects, presented as an index rather than another set of
 * full-viewport stagings — the hierarchy of the page depends on these being
 * quieter than the three above.
 */
export function MoreWork({ id, sectionRef, visible }: MoreWorkProps) {
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.more}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible} timeout={0}>
        {({ visible: entered }) => (
          <div className={styles.content}>
            <SectionLabel index="05" label="Also built" visible={entered} />
            <Heading
              level={3}
              as="h2"
              id={titleId}
              className={styles.title}
              data-visible={entered}
            >
              Shorter projects, same habit.
            </Heading>

            <ul className={styles.list}>
              {additionalWork.map((item, index) => (
                <li
                  key={item.id}
                  className={styles.row}
                  data-visible={entered}
                  style={cssProps({ delay: 300 + index * 140 })}
                >
                  <span className={styles.rowIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className={styles.rowMain}>
                    <h3 className={styles.rowTitle}>{item.title}</h3>
                    <p className={styles.rowMeta}>
                      {item.venue} · {item.period}
                    </p>
                    <p className={styles.rowDescription}>{item.description}</p>
                    <ul className={styles.stack}>
                      {item.stack.map(tech => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.rowMetric}>
                    <span className={styles.metricValue}>{item.metric.value}</span>
                    <span className={styles.metricLabel}>{item.metric.label}</span>
                  </div>
                </li>
              ))}
            </ul>

            <a
              className={styles.repoLink}
              data-visible={entered}
              href={config.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Code on GitHub</span>
              <Icon icon="external" size={18} />
            </a>
          </div>
        )}
      </Transition>
    </Section>
  );
}
