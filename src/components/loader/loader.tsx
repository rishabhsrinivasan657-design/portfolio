import { useReducedMotion } from 'framer-motion';
import { forwardRef } from 'react';
import { Text } from '~/components/text';
import { classes, cssProps } from '~/utils/style';
import type { BaseProps } from '~/utils/types';
import styles from './loader.module.css';

type LoaderProps = Omit<BaseProps, 'children'> & {
  width?: number;
  height?: number;
  text?: string;
  center?: boolean;
  /** Accepted so callers can size the loader inline; not forwarded to the DOM. */
  size?: number;
};

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  (
    { className, style, width = 32, height = 4, text = 'Loading...', center, size: _size, ...rest },
    ref
  ) => {
    const reduceMotion = useReducedMotion();

    if (reduceMotion) {
      return (
        <Text className={classes(styles.text, className)} weight="medium" {...rest}>
          {text}
        </Text>
      );
    }

    return (
      <div
        ref={ref}
        className={classes(styles.loader, className)}
        data-center={center}
        style={cssProps({ width, height }, style)}
        {...rest}
      >
        <div className={styles.span} />
      </div>
    );
  }
);

Loader.displayName = 'Loader';
