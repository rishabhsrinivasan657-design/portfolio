import { DecoderText } from '~/components/decoder-text';
import { Heading } from '~/components/heading';
import { Icon, type IconName } from '~/components/icon';
import { Section } from '~/components/section';
import { SectionLabel } from '~/components/section-label';
import { Transition } from '~/components/transition';
import config from '~/config';
import { cssProps } from '~/utils/style';
import styles from './contact.module.css';

type ContactProps = {
  id: string;
  sectionRef: React.RefObject<HTMLElement>;
  visible: boolean;
};

const CHANNELS: Array<{ label: string; value: string; href: string; icon: IconName }> = [
  {
    label: 'LinkedIn',
    value: 'in/rishabh-srinivasan',
    href: config.linkedin,
    icon: 'linkedin',
  },
  {
    label: 'GitHub',
    value: config.githubHandle,
    href: config.github,
    icon: 'github',
  },
  {
    label: 'Résumé',
    value: 'PDF · one page',
    href: `${import.meta.env.BASE_URL}${config.resume}`,
    icon: 'download',
  },
];

export function Contact({ id, sectionRef, visible }: ContactProps) {
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.contact}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible} timeout={0}>
        {({ visible: entered }) => (
          <div className={styles.content}>
            <SectionLabel index="06" label="Contact" visible={entered} />

            <Heading
              level={2}
              as="h2"
              id={titleId}
              className={styles.title}
              data-visible={entered}
            >
              If the data is messy, the stakeholders disagree, and something still has to
              ship — that’s the interesting part.
            </Heading>

            {/* The address is the call to action; everything else is secondary. */}
            <a className={styles.email} href={`mailto:${config.email}`} data-visible={entered}>
              <span className={styles.emailInner}>
                <DecoderText text={config.email} start={entered} delay={700} />
              </span>
              <Icon className={styles.emailIcon} icon="arrow-right" size={28} />
            </a>

            <ul className={styles.channels}>
              {CHANNELS.map((channel, index) => (
                <li
                  key={channel.label}
                  className={styles.channel}
                  data-visible={entered}
                  style={cssProps({ delay: 700 + index * 120 })}
                >
                  <a
                    className={styles.channelLink}
                    href={channel.href}
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    {...(channel.icon === 'download' ? { download: '' } : {})}
                  >
                    <Icon icon={channel.icon} size={20} />
                    <span className={styles.channelText}>
                      <span className={styles.channelLabel}>{channel.label}</span>
                      <span className={styles.channelValue}>{channel.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Transition>
    </Section>
  );
}
