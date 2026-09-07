import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from '~/components/icon';
import { Loader } from '~/components/loader';
import { Transition } from '~/components/transition';
import { classes } from '~/utils/style';
import type { BaseProps } from '~/utils/types';
import styles from './button.module.css';

function isExternalLink(href?: string) {
  return Boolean(href && (href.includes('://') || href.startsWith('mailto:')));
}

/** Links that leave the SPA: files, hashes, protocols. */
function isPlainAnchor(href?: string) {
  if (!href) return false;
  return (
    isExternalLink(href) || href.startsWith('#') || /\.(pdf|txt|png|jpe?g|svg)$/i.test(href)
  );
}

type ButtonProps = BaseProps & {
  href?: string;
  as?: React.ElementType;
  secondary?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: IconName;
  iconEnd?: IconName;
  iconHoverShift?: boolean;
  iconOnly?: boolean;
  rel?: string;
  target?: string;
  disabled?: boolean;
  download?: boolean | string;
  type?: 'button' | 'submit' | 'reset';
  to?: string;
};

export const Button = forwardRef<HTMLElement, ButtonProps>(({ href, ...rest }, ref) => {
  if (isPlainAnchor(href) || !href) {
    return <ButtonContent href={href} ref={ref} {...rest} />;
  }

  return <ButtonContent as={Link} to={href} ref={ref} {...rest} />;
});

Button.displayName = 'Button';

const ButtonContent = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      className,
      as,
      secondary,
      loading,
      loadingText = 'loading',
      icon,
      iconEnd,
      iconHoverShift,
      iconOnly,
      children,
      rel,
      target,
      href,
      disabled,
      ...rest
    },
    ref
  ) => {
    const isExternal = isExternalLink(href);
    const defaultComponent = href ? 'a' : 'button';
    const Component = (as || defaultComponent) as React.ElementType;

    return (
      <Component
        className={classes(styles.button, className)}
        data-loading={loading}
        data-icon-only={iconOnly}
        data-secondary={secondary}
        data-icon={icon}
        href={href}
        rel={rel || (isExternal ? 'noopener noreferrer' : undefined)}
        target={target || (isExternal ? '_blank' : undefined)}
        disabled={disabled}
        ref={ref}
        {...rest}
      >
        {!!icon && (
          <Icon
            className={styles.icon}
            data-start={!iconOnly}
            data-shift={iconHoverShift}
            icon={icon}
          />
        )}
        {!!children && <span className={styles.text}>{children}</span>}
        {!!iconEnd && (
          <Icon
            className={styles.icon}
            data-end={!iconOnly}
            data-shift={iconHoverShift}
            icon={iconEnd}
          />
        )}
        <Transition unmount in={loading}>
          {({ visible, nodeRef }) => (
            <Loader
              ref={nodeRef as React.RefObject<HTMLDivElement>}
              className={styles.loader}
              size={32}
              text={loadingText}
              data-visible={visible}
            />
          )}
        </Transition>
      </Component>
    );
  }
);

ButtonContent.displayName = 'ButtonContent';
