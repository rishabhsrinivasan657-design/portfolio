import { forwardRef } from 'react';
import type { BaseProps } from '~/utils/types';
import { classes } from '~/utils/style';
import styles from './section.module.css';

type SectionProps = BaseProps & {
  as?: React.ElementType;
};

/**
 * Horizontal gutters for every full-width block. The left gutter is wider on
 * desktop to clear the fixed vertical navbar.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ as: Component = 'div', children, className, ...rest }, ref) => (
    <Component className={classes(styles.section, className)} ref={ref} {...rest}>
      {children}
    </Component>
  )
);

Section.displayName = 'Section';
