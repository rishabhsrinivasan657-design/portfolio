import type { BaseProps } from '~/utils/types';
import { classes } from '~/utils/style';
import styles from './heading.module.css';

type HeadingProps = BaseProps & {
  level?: 0 | 1 | 2 | 3 | 4 | 5;
  as?: React.ElementType;
  align?: 'auto' | 'start' | 'center';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
};

export const Heading = ({
  children,
  level = 1,
  as,
  align = 'auto',
  weight = 'medium',
  className,
  ...rest
}: HeadingProps) => {
  const clampedLevel = Math.min(Math.max(level, 0), 5);
  const Component = as || (`h${Math.max(clampedLevel, 1)}` as React.ElementType);

  return (
    <Component
      className={classes(styles.heading, className)}
      data-align={align}
      data-weight={weight}
      data-level={clampedLevel}
      {...rest}
    >
      {children}
    </Component>
  );
};
