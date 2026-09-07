/**
 * Media query breakpoints. Mirrors the values declared in `styles/media.css`
 * so JS and CSS agree on where the layout changes.
 */
export const media = {
  desktop: 2080,
  laptop: 1680,
  tablet: 1040,
  mobile: 696,
  mobileS: 400,
} as const;

export type Breakpoint = keyof typeof media;

/** Convert a px string to a number */
export const pxToNum = (px: string) => Number(px.replace('px', ''));

/** Convert a number to a px string */
export const numToPx = (num: number) => `${num}px`;

/** Convert pixel values to rem so type scales with the user's font size */
export const pxToRem = (px: number) => `${px / 16}rem`;

/** Convert an ms token value to a raw number */
export const msToNum = (ms: string) => Number(ms.replace('ms', ''));

/** Convert a number to an ms string */
export const numToMs = (num: number) => `${num}ms`;

/** Linearly map `value` from one range to another, clamped to the output range */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  const t = (value - inMin) / (inMax - inMin || 1);
  return outMin + Math.min(Math.max(t, 0), 1) * (outMax - outMin);
}

/** Clamp a number between min and max */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

type CssPropValue = string | number | undefined | null;

/**
 * Turn a plain object into `--` prefixed custom properties, so components can
 * pass values into their stylesheet without inline style soup. Numbers are
 * coerced to the unit the property name implies.
 */
export function cssProps(
  props: Record<string, CssPropValue>,
  style: React.CSSProperties = {}
): React.CSSProperties {
  const result: Record<string, string> = {};

  for (const key of Object.keys(props)) {
    const raw = props[key];
    if (raw === undefined || raw === null) continue;

    let value = raw;

    if (typeof value === 'number') {
      if (key === 'delay' || key.endsWith('Delay') || key.endsWith('Duration')) {
        value = numToMs(value);
      } else if (key === 'opacity') {
        value = `${value * 100}%`;
      } else if (key === 'index' || key === 'count' || key === 'progress') {
        value = String(value);
      } else {
        value = numToPx(value);
      }
    }

    result[`--${key}`] = value as string;
  }

  return { ...result, ...style } as React.CSSProperties;
}

/** Join truthy class names */
export function classes(...values: Array<string | false | undefined | null>) {
  return values.filter(Boolean).join(' ');
}
