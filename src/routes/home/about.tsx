import { DecoderText } from '~/components/decoder-text';
import { Heading } from '~/components/heading';
import { Link } from '~/components/link';
import { Section } from '~/components/section';
import { SectionLabel } from '~/components/section-label';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { recognition } from '~/data/profile';
import { cssProps } from '~/utils/style';
import { Portrait } from './portrait';
import styles from './about.module.css';

type AboutProps = {
  id: string;
  sectionRef: React.RefObject<HTMLElement>;
  visible: boolean;
};

export function About({ id, sectionRef, visible }: AboutProps) {
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.about}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible} timeout={0}>
        {({ visible: entered }) => (
          <div className={styles.content}>
            <div className={styles.column}>
              <Heading
                level={3}
                as="h2"
                id={titleId}
                className={styles.title}
                data-visible={entered}
              >
                <DecoderText text="How I work" start={entered} delay={400} />
              </Heading>

              <Text size="l" as="p" className={styles.copy} data-visible={entered}>
                I’m Rishabh. I’m finishing an M.S. in Information Systems &amp; AI at the
                University of Maryland, and nearly everything I’ve worked on has lived in
                the same gap — between a question someone needs answered and a system that
                can answer it repeatedly.
              </Text>

              <Text
                size="l"
                as="p"
                className={styles.copy}
                data-visible={entered}
                style={cssProps({ delay: 120 })}
              >
                That has looked different in every room. At AdvaGen Pharma it meant
                following SAP sales bids through Selenium and Power Automate until five
                hours of weekly manual work disappeared, then writing the picking-list
                logic that kept $50K of inventory from going stale. At S.P. Jain it meant
                feature engineering across 5,000 player records and an integer program
                that had to respect a budget across 38 gameweeks. At Maryland DGS it meant
                sitting with departments that disagreed and leaving with one data model.
                Lately it has meant agent graphs — nine of them coordinating a{' '}
                <Link href="/projects/agentic-financial-advisory">
                  financial advisory workflow
                </Link>
                , including one whose entire job is to disagree with the others.
              </Text>

              <Text
                size="l"
                as="p"
                className={styles.copy}
                data-visible={entered}
                style={cssProps({ delay: 240 })}
              >
                The through-line isn’t a stack. It’s that I’d rather understand why a
                number moved than ship something that only reports it.
              </Text>

              <div className={styles.recognition} data-visible={entered}>
                <h3 className={styles.recognitionLabel}>Recognition</h3>
                <ul className={styles.recognitionList}>
                  {recognition.map((item, index) => (
                    <li
                      key={item.title}
                      className={styles.recognitionItem}
                      style={cssProps({ delay: 500 + index * 130 })}
                    >
                      <span className={styles.recognitionTitle}>{item.title}</span>
                      <span className={styles.recognitionDetail}>{item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.column}>
              <SectionLabel index="04" label="About" visible={entered} />
              <Portrait visible={entered} />
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
}
