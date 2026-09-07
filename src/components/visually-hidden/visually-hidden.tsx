import { classes } from '~/utils/style';
import type { BaseProps } from '~/utils/types';
import styles from './visually-hidden.module.css';

type VisuallyHiddenProps = BaseProps & {
  showOnFocus?: boolean;
  as?: React.ElementType;
  visible?: boolean;
  href?: string;
};

export const VisuallyHidden = ({
  className,
  showOnFocus,
  as: Component = 'span',
  children,
  visible,
  ...rest
}: VisuallyHiddenProps) => (
  <Component
    className={classes(styles.hidden, className)}
    data-hidden={!visible && !showOnFocus}
    data-show-on-focus={showOnFocus}
    {...rest}
  >
    {children}
  </Component>
);
