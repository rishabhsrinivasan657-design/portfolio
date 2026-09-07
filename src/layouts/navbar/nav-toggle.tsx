import { Button } from '~/components/button';
import { Icon } from '~/components/icon';
import styles from './nav-toggle.module.css';

export const NavToggle = ({ menuOpen, ...rest }: { menuOpen: boolean; [key: string]: unknown }) => (
  <Button
    iconOnly
    className={styles.toggle}
    aria-label="Menu"
    aria-expanded={menuOpen}
    {...rest}
  >
    <div className={styles.inner}>
      <Icon className={styles.icon} data-menu data-open={menuOpen} icon="menu" />
      <Icon className={styles.icon} data-close data-open={menuOpen} icon="close" />
    </div>
  </Button>
);
