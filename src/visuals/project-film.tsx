import { useEffect, useRef } from 'react';
import type { Project } from '~/data/profile';
import { useInViewport } from '~/hooks';
import styles from './project-film.module.css';

type ProjectFilmProps = {
  film: NonNullable<Project['film']>;
  visible?: boolean;
};

/**
 * A rendered product film, for projects with a real interface to show. It
 * plays muted and looped while on screen and pauses when scrolled away.
 * With reduced motion it never autoplays: the poster holds and the native
 * controls are there for anyone who wants to press play.
 */
export const ProjectFilm = ({ film, visible }: ProjectFilmProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onScreen = useInViewport(videoRef, false, { threshold: 0.4 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (visible && onScreen && !reduceMotion) {
      // Autoplay can still be refused (e.g. low-power mode); the poster and
      // controls remain, so there is nothing to recover from.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [visible, onScreen]);

  const base = import.meta.env.BASE_URL;

  return (
    <video
      ref={videoRef}
      className={styles.film}
      data-visible={visible}
      src={`${base}${film.src}`}
      poster={`${base}${film.poster}`}
      aria-label={film.label}
      width={1920}
      height={1080}
      muted
      loop
      playsInline
      controls
      preload="metadata"
    />
  );
};
