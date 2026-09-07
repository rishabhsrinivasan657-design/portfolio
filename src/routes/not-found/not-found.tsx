import { useEffect } from 'react';
import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import styles from './not-found.module.css';

export const NotFound = () => {
  useEffect(() => {
    document.title = 'Not found — Rishabh Srinivasan';
  }, []);

  return (
    <Section as="section" className={styles.notFound}>
      <div className={styles.content}>
        <span className={styles.code}>
          <DecoderText text="404" delay={200} />
        </span>
        <Heading level={2} as="h1" className={styles.title}>
          No data at this coordinate.
        </Heading>
        <Text size="l" as="p" className={styles.copy}>
          The page you asked for isn’t here. It may have moved, or the link may have been
          mistyped.
        </Text>
        <Button iconHoverShift iconEnd="arrow-right" href="/">
          Back to the start
        </Button>
      </div>
    </Section>
  );
};
