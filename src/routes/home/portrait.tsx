import { useEffect, useState } from 'react';
import { Image } from '~/components/image';
import { PlotMotif } from '~/components/plot-motif';
import config from '~/config';
import { education } from '~/data/profile';
import styles from './portrait.module.css';

/**
 * Drop a photo at `public/profile/portrait.jpg` (portrait crop, ~960×1280)
 * and it takes this slot automatically. Until then — or if the file is
 * missing in a deploy — the designed identity panel below stands in, so the
 * composition never shows a broken frame.
 */
const PORTRAIT_SRC = `${import.meta.env.BASE_URL}profile/portrait.jpg`;

type Status = 'checking' | 'present' | 'absent';

export const Portrait = ({ visible }: { visible: boolean }) => {
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => setStatus('present');
    probe.onerror = () => setStatus('absent');
    probe.src = PORTRAIT_SRC;

    return () => {
      probe.onload = null;
      probe.onerror = null;
    };
  }, []);

  if (status === 'present') {
    return (
      <div className={styles.frame}>
        <Image
          reveal
          delay={100}
          src={PORTRAIT_SRC}
          // Intrinsic size of portrait.jpg, so the frame reserves the right
          // height before the file decodes and the section never reflows.
          width={1107}
          height={1733}
          sizes="(max-width: 696px) 100vw, 420px"
          alt={config.name}
        />
        <PlotMotif
          className={styles.motif}
          orientation="vertical"
          visible={visible}
        />
      </div>
    );
  }

  // `checking` renders the panel too — it appears instantly and is replaced
  // only if a real photo resolves, which avoids a hole in the layout.
  return (
    <div className={styles.panel} data-visible={visible}>
      <div className={styles.panelInner}>
        <div className={styles.mark} aria-hidden>
          {config.initials}
        </div>
        <dl className={styles.facts}>
          {education.map(item => (
            <div className={styles.fact} key={item.school}>
              <dt>{item.school}</dt>
              <dd>{item.degree}</dd>
              <dd data-meta>
                {item.period} · {item.grade}
              </dd>
            </div>
          ))}
          <div className={styles.fact}>
            <dt>Based</dt>
            <dd>{config.location}</dd>
            <dd data-meta>{config.coordinates}</dd>
          </div>
        </dl>
      </div>
      <PlotMotif className={styles.motif} orientation="vertical" visible={visible} />
    </div>
  );
};
