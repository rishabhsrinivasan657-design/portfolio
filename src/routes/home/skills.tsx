import { useMemo, useState } from 'react';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { SectionLabel } from '~/components/section-label';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { skillGroups } from '~/data/profile';
import { cssProps } from '~/utils/style';
import styles from './skills.module.css';

type SkillsProps = {
  id: string;
  sectionRef: React.RefObject<HTMLElement>;
  visible: boolean;
};

/**
 * Every skill is on screen at once — selecting a category focuses it rather
 * than filtering the rest away. Breadth and specialism read at the same time,
 * which is the whole positioning argument in one control.
 */
export function Skills({ id, sectionRef, visible }: SkillsProps) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const titleId = `${id}-title`;

  const allSkills = useMemo(
    () =>
      skillGroups.flatMap(group =>
        group.skills.map(skill => ({ skill, group: group.id }))
      ),
    []
  );

  const active = skillGroups.find(group => group.id === activeGroup);

  return (
    <Section
      className={styles.skills}
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
              <SectionLabel index="03" label="Capability" visible={entered} />
              <Heading
                level={2}
                as="h2"
                id={titleId}
                className={styles.title}
                data-visible={entered}
              >
                <span className={styles.line}>The toolkit, grouped by</span>{' '}
                <span className={styles.line}>what it is actually for.</span>
              </Heading>
            </header>

            <div className={styles.body}>
              <div className={styles.groups} data-visible={entered}>
                {skillGroups.map((group, index) => (
                  <button
                    key={group.id}
                    type="button"
                    className={styles.group}
                    data-active={group.id === activeGroup}
                    data-dimmed={Boolean(activeGroup) && group.id !== activeGroup}
                    aria-pressed={group.id === activeGroup}
                    style={cssProps({ delay: 400 + index * 90 })}
                    onClick={() =>
                      setActiveGroup(current => (current === group.id ? null : group.id))
                    }
                    onMouseEnter={() => setActiveGroup(group.id)}
                    onFocus={() => setActiveGroup(group.id)}
                  >
                    <span className={styles.groupCount}>
                      {String(group.skills.length).padStart(2, '0')}
                    </span>
                    <span className={styles.groupText}>
                      <span className={styles.groupLabel}>{group.label}</span>
                      <span className={styles.groupCaption}>{group.caption}</span>
                    </span>
                    <span className={styles.groupBar} aria-hidden>
                      <span
                        className={styles.groupBarFill}
                        style={cssProps({
                          progress: group.skills.length / 20,
                          delay: 700 + index * 110,
                        })}
                      />
                    </span>
                  </button>
                ))}
              </div>

              <div
                className={styles.field}
                onMouseLeave={() => setActiveGroup(null)}
                data-visible={entered}
              >
                <ul className={styles.grid} aria-label="Skills">
                  {allSkills.map((item, index) => (
                    <li
                      key={item.skill}
                      className={styles.skill}
                      data-active={item.group === activeGroup}
                      data-dimmed={Boolean(activeGroup) && item.group !== activeGroup}
                      style={cssProps({ delay: 500 + index * 14 })}
                    >
                      {item.skill}
                    </li>
                  ))}
                </ul>

                <div className={styles.readout} aria-live="polite">
                  <Text size="s" mono className={styles.readoutText}>
                    {active
                      ? `${active.label.toUpperCase()} — ${active.skills.length} of ${allSkills.length}`
                      : `${allSkills.length} TOOLS · 4 GROUPS`}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
}
