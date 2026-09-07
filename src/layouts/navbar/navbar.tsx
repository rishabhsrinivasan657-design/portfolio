import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Icon } from '~/components/icon';
import { Monogram } from '~/components/monogram';
import { useTheme } from '~/components/theme';
import { tokens } from '~/components/theme/theme';
import { Transition } from '~/components/transition';
import config from '~/config';
import { useScrollToHash, useWindowSize } from '~/hooks';
import { cssProps, media, msToNum, numToMs } from '~/utils/style';
import { navLinks, socialLinks } from './nav-data';
import { NavToggle } from './nav-toggle';
import { ThemeToggle } from './theme-toggle';
import styles from './navbar.module.css';

export const Navbar = () => {
  const [current, setCurrent] = useState<string>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [target, setTarget] = useState<string | null>(null);
  const { theme } = useTheme();
  const location = useLocation();
  const windowSize = useWindowSize();
  const headerRef = useRef<HTMLElement>(null);
  const isMobile = windowSize.width <= media.mobile || windowSize.height <= 696;
  const scrollToHash = useScrollToHash();

  useEffect(() => {
    setCurrent(`${location.pathname}${location.hash}`);
  }, [location]);

  // Smooth-scroll nav items rather than letting the router jump
  useEffect(() => {
    if (!target || location.pathname !== '/') return;
    setCurrent(`${location.pathname}${target}`);
    scrollToHash(target, () => setTarget(null));
  }, [location.pathname, scrollToHash, target]);

  // Lock the page behind the mobile menu
  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  /**
   * Sections that invert the palette (the analysis panel) would otherwise
   * swallow the nav. Measure the inverted blocks and flip any nav item that
   * currently overlaps one.
   */
  useEffect(() => {
    const navItems = document.querySelectorAll<HTMLElement>('[data-navbar-item]');
    const inverseTheme = theme === 'dark' ? 'light' : 'dark';
    const { innerHeight } = window;

    let navItemMeasurements: Array<{ element: HTMLElement; top: number; bottom: number }> = [];

    /**
     * Require the inverted block to cover most of the nav item, not merely
     * touch it. A bare intersection test flips an icon that is one pixel
     * inside the slab, leaving it dark-on-dark at the boundary.
     */
    const isOverlap = (
      inverse: { top: number; bottom: number },
      item: { top: number; bottom: number },
      scrollY: number
    ) => {
      const top = Math.max(inverse.top - scrollY, item.top);
      const bottom = Math.min(inverse.bottom - scrollY, item.bottom);
      const covered = bottom - top;
      return covered > (item.bottom - item.top) / 2;
    };

    const resetNavTheme = () => {
      for (const measurement of navItemMeasurements) {
        measurement.element.dataset.theme = '';
      }
    };

    const handleInversion = () => {
      const invertedElements = document.querySelectorAll<HTMLElement>(
        `[data-theme='${inverseTheme}'][data-invert]`
      );

      if (!invertedElements.length) return;

      const inverseMeasurements = Array.from(invertedElements).map(item => ({
        element: item,
        top: item.offsetTop,
        bottom: item.offsetTop + item.offsetHeight,
      }));

      const { scrollY } = window;

      resetNavTheme();

      for (const inverseMeasurement of inverseMeasurements) {
        if (
          inverseMeasurement.top - scrollY > innerHeight ||
          inverseMeasurement.bottom - scrollY < 0
        ) {
          continue;
        }

        for (const measurement of navItemMeasurements) {
          measurement.element.dataset.theme = isOverlap(
            inverseMeasurement,
            measurement,
            scrollY
          )
            ? inverseTheme
            : '';
        }
      }
    };

    navItemMeasurements = Array.from(navItems).map(item => {
      const rect = item.getBoundingClientRect();
      return { element: item, top: rect.top, bottom: rect.bottom };
    });

    document.addEventListener('scroll', handleInversion, { passive: true });
    handleInversion();

    return () => {
      document.removeEventListener('scroll', handleInversion);
      resetNavTheme();
    };
  }, [theme, windowSize, location.key]);

  const getCurrent = (url = '') => {
    const nonTrailing = current?.endsWith('/') ? current?.slice(0, -1) : current;
    return url === nonTrailing ? 'page' : undefined;
  };

  const handleNavItemClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const hash = event.currentTarget.href.split('#')[1];
    setTarget(null);

    if (hash && location.pathname === '/') {
      setTarget(`#${hash}`);
      event.preventDefault();
    }
  };

  const handleMobileNavClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    handleNavItemClick(event);
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <header className={styles.navbar} ref={headerRef}>
      <RouterLink
        to={location.pathname === '/' ? '/#intro' : '/'}
        data-navbar-item
        className={styles.logo}
        aria-label={`${config.name}, ${config.role}`}
        onClick={handleMobileNavClick}
      >
        <Monogram highlight />
      </RouterLink>
      <NavToggle onClick={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
      <nav className={styles.nav}>
        <div className={styles.navList}>
          {navLinks.map(({ label, pathname }) => (
            <RouterLink
              to={pathname}
              key={label}
              data-navbar-item
              className={styles.navLink}
              aria-current={getCurrent(pathname)}
              onClick={handleNavItemClick}
            >
              {label}
            </RouterLink>
          ))}
        </div>
        <NavbarIcons desktop />
      </nav>
      <Transition unmount in={menuOpen} timeout={msToNum(tokens.base.durationL)}>
        {({ visible, nodeRef }) => (
          <nav
            className={styles.mobileNav}
            data-visible={visible}
            ref={nodeRef as React.RefObject<HTMLElement>}
          >
            {navLinks.map(({ label, pathname }, index) => (
              <RouterLink
                to={pathname}
                key={label}
                className={styles.mobileNavLink}
                data-visible={visible}
                aria-current={getCurrent(pathname)}
                onClick={handleMobileNavClick}
                style={cssProps({
                  transitionDelay: numToMs(
                    Number(msToNum(tokens.base.durationS)) + index * 50
                  ),
                })}
              >
                {label}
              </RouterLink>
            ))}
            <NavbarIcons />
            <ThemeToggle isMobile />
          </nav>
        )}
      </Transition>
      {!isMobile && <ThemeToggle data-navbar-item />}
    </header>
  );
};

const NavbarIcons = ({ desktop }: { desktop?: boolean }) => (
  <div className={styles.navIcons}>
    {socialLinks.map(({ label, url, icon }) => (
      <a
        key={label}
        data-navbar-item={desktop || undefined}
        className={styles.navIconLink}
        aria-label={label}
        href={url}
        target={url.startsWith('mailto:') ? undefined : '_blank'}
        rel="noopener noreferrer"
      >
        <Icon className={styles.navIcon} icon={icon} />
      </a>
    ))}
  </div>
);
