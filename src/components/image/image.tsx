import { useCallback, useRef, useState } from 'react';
import { useInViewport } from '~/hooks';
import { classes, cssProps, numToMs } from '~/utils/style';
import styles from './image.module.css';

type ImageProps = {
  className?: string;
  style?: React.CSSProperties;
  /** Wipe the accent colour across the frame instead of fading in */
  reveal?: boolean;
  delay?: number;
  raised?: boolean;
  src?: string;
  srcSet?: string;
  /** A tiny, blurred stand-in shown until the full image decodes */
  placeholder?: string;
  alt: string;
  sizes?: string;
  width?: number;
  height?: number;
  cover?: boolean;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'placeholder' | 'width' | 'height'>;

export const Image = ({
  className,
  style,
  reveal,
  delay = 0,
  raised,
  src: baseSrc,
  srcSet,
  placeholder,
  alt,
  sizes,
  width,
  height,
  cover,
  ...rest
}: ImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(Boolean(placeholder));
  const containerRef = useRef<HTMLDivElement>(null);
  const src = baseSrc || srcSet?.split(' ')[0];
  const inViewport = useInViewport(containerRef, true);

  const onLoad = useCallback(() => setLoaded(true), []);

  return (
    <div
      className={classes(styles.image, className)}
      data-visible={inViewport || loaded}
      data-reveal={reveal}
      data-raised={raised}
      style={cssProps({ delay: numToMs(delay) }, style)}
      ref={containerRef}
    >
      <div
        className={styles.elementWrapper}
        data-reveal={reveal}
        data-visible={inViewport || loaded}
        style={cssProps({ delay: numToMs(delay + 1000) })}
      >
        <img
          className={styles.element}
          data-loaded={loaded}
          data-cover={cover}
          onLoad={onLoad}
          decoding="async"
          src={inViewport ? src : undefined}
          srcSet={inViewport ? srcSet : undefined}
          width={width}
          height={height}
          alt={alt}
          sizes={sizes}
          {...rest}
        />
        {showPlaceholder && (
          <img
            aria-hidden
            className={styles.placeholder}
            data-loaded={loaded}
            data-cover={cover}
            style={cssProps({ delay: numToMs(delay) })}
            src={placeholder}
            width={width}
            height={height}
            onTransitionEnd={() => setShowPlaceholder(false)}
            decoding="async"
            loading="lazy"
            alt=""
            role="presentation"
          />
        )}
      </div>
    </div>
  );
};
