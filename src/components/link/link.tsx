import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { classes } from '~/utils/style';
import type { BaseProps } from '~/utils/types';
import styles from './link.module.css';

const VALID_EXT = ['txt', 'png', 'jpg', 'jpeg', 'svg', 'pdf'];

function isAnchor(href?: string) {
  if (!href) return true;
  const isValidExtension = VALID_EXT.includes(href.split('.').pop() ?? '');
  return (
    href.includes('://') || href.startsWith('#') || href.startsWith('mailto:') || isValidExtension
  );
}

type LinkProps = BaseProps & {
  rel?: string;
  target?: string;
  secondary?: boolean;
  href?: string;
};

/**
 * The underline is a background gradient rather than a border, so it can grow
 * from the left on hover instead of just changing colour.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ rel, target, children, secondary, className, href, ...rest }, ref) => {
    const isExternal = Boolean(href?.includes('://'));

    const linkProps = {
      className: classes(styles.link, className),
      'data-secondary': secondary,
      rel: rel || (isExternal ? 'noreferrer noopener' : undefined),
      target: target || (isExternal ? '_blank' : undefined),
      ref,
      ...rest,
    };

    if (isAnchor(href)) {
      return (
        <a {...linkProps} href={href}>
          {children}
        </a>
      );
    }

    return (
      <RouterLink {...linkProps} to={href!}>
        {children}
      </RouterLink>
    );
  }
);

Link.displayName = 'Link';
