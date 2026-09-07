import { Divider } from '~/components/divider';
import { classes, cssProps } from '~/utils/style';
import styles from './section-label.module.css';

type SectionLabelProps = {
  /** Zero-padded section index, e.g. "03" */
  index?: string;
  label: string;
  visible?: boolean;
  collapseDelay?: number;
  className?: string;
  align?: 'start' | 'end';
};

/**
 * The rule-and-metadata header that opens every section. The divider draws
 * itself in, then the label slides across a beat later.
 */
export const SectionLabel = ({
  index,
  label,
  visible = true,
  collapseDelay = 600,
  className,
  align = 'start',
}: SectionLabelProps) => (
  <div className={classes(styles.tag, className)} data-align={align} aria-hidden>
    <Divider
      notchWidth="64px"
      notchHeight="8px"
      collapsed={!visible}
      collapseDelay={collapseDelay}
    />
    <div
      className={styles.text}
      data-visible={visible}
      style={cssProps({ delay: collapseDelay + 400 })}
    >
      {index && <span className={styles.index}>{index}</span>}
      <span className={styles.label}>{label}</span>
    </div>
  </div>
);
