import { Text } from '~/components/text';
import config from '~/config';
import { classes } from '~/utils/style';
import styles from './footer.module.css';

export const Footer = ({ className }: { className?: string }) => (
  <footer className={classes(styles.footer, className)}>
    <div className={styles.rule} />
    <div className={styles.row}>
      <Text size="s" mono secondary className={styles.item}>
        {`© ${new Date().getFullYear()} ${config.name}`}
      </Text>
      <Text size="s" mono secondary className={styles.item}>
        {config.coordinates}
      </Text>
      <Text size="s" mono secondary className={styles.item}>
        React · TypeScript · Three.js
      </Text>
    </div>
  </footer>
);
