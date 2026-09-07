import { classes, cssProps, numToMs } from '~/utils/style';
import type { BaseProps } from '~/utils/types';
import styles from './divider.module.css';

type DividerProps = Omit<BaseProps, 'children'> & {
  lineWidth?: string;
  lineHeight?: string;
  notchWidth?: string;
  notchHeight?: string;
  collapseDelay?: number;
  collapsed?: boolean;
};

/**
 * A rule with a chamfered notch hanging off its left edge. Collapsing it
 * wipes the line out from the left and closes the notch a beat later.
 */
export const Divider = ({
  lineWidth = '100%',
  lineHeight = '2px',
  notchWidth = '90px',
  notchHeight = '10px',
  collapseDelay = 0,
  collapsed = false,
  className,
  style,
  ...rest
}: DividerProps) => (
  <div
    className={classes(styles.divider, className)}
    style={cssProps(
      {
        lineWidth,
        lineHeight,
        notchWidth,
        notchHeight,
        collapseDelay: numToMs(collapseDelay),
      },
      style
    )}
    {...rest}
  >
    <div className={styles.line} data-collapsed={collapsed} />
    <div
      className={styles.notch}
      data-collapsed={collapsed}
      style={cssProps({ collapseDelay: numToMs(collapseDelay + 160) })}
    />
  </div>
);
