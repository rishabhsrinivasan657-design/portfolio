import { forwardRef } from 'react';
import { classes } from '~/utils/style';
import type { SvgBaseProps } from '~/utils/types';
import { icons, type IconName } from './icons';
import styles from './icon.module.css';

type IconProps = Omit<SvgBaseProps, 'children'> & {
  icon: IconName;
  size?: number;
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon, className, size, ...rest }, ref) => {
    const definition = icons[icon];

    return (
      <svg
        aria-hidden
        ref={ref}
        className={classes(styles.icon, className)}
        data-mode={definition.mode}
        width={size || 24}
        height={size || 24}
        viewBox="0 0 24 24"
        {...rest}
      >
        {definition.content}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';
