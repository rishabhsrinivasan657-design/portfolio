import type { BaseProps } from '~/utils/types';
import { classes } from '~/utils/style';
import styles from './text.module.css';

type TextProps = BaseProps & {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  as?: React.ElementType;
  align?: 'auto' | 'start' | 'center';
  weight?: 'auto' | 'regular' | 'medium' | 'semibold' | 'bold';
  secondary?: boolean;
  mono?: boolean;
};

export const Text = ({
  children,
  size = 'm',
  as: Component = 'span',
  align = 'auto',
  weight = 'auto',
  secondary,
  mono,
  className,
  ...rest
}: TextProps) => (
  <Component
    className={classes(styles.text, className)}
    data-align={align}
    data-size={size}
    data-weight={weight}
    data-secondary={secondary}
    data-mono={mono}
    {...rest}
  >
    {children}
  </Component>
);
