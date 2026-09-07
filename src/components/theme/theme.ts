import { pxToRem } from '~/utils/style';

/**
 * Design tokens.
 *
 * Everything here is emitted as a CSS custom property by `theme-styles.ts`.
 * The scale is deliberately coarse — a small number of steps used
 * consistently reads as more considered than a large number used loosely.
 */
const baseTokens = {
  black: 'oklch(0% 0 0)',
  white: 'oklch(100% 0 0)',

  bezierFastoutSlowin: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  bezierPrecision: 'cubic-bezier(0.16, 1, 0.3, 1)',
  durationXS: '200ms',
  durationS: '300ms',
  durationM: '400ms',
  durationL: '600ms',
  durationXL: '800ms',
  duration2XL: '1200ms',

  systemFontStack:
    'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, sans-serif',
  fontStack: `'Inter Variable', var(--systemFontStack)`,
  displayFontStack: `'Space Grotesk Variable', 'Inter Variable', var(--systemFontStack)`,
  monoFontStack: `'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,

  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,

  fontSizeH0: pxToRem(140),
  fontSizeH1: pxToRem(100),
  fontSizeH2: pxToRem(58),
  fontSizeH3: pxToRem(38),
  fontSizeH4: pxToRem(28),
  fontSizeH5: pxToRem(24),
  fontSizeBodyXL: pxToRem(22),
  fontSizeBodyL: pxToRem(20),
  fontSizeBodyM: pxToRem(18),
  fontSizeBodyS: pxToRem(16),
  fontSizeBodyXS: pxToRem(14),
  fontSizeMonoS: pxToRem(13),
  fontSizeMonoXS: pxToRem(11),

  lineHeightTitle: '1.06',
  lineHeightBody: '1.6',

  maxWidthS: '540px',
  maxWidthM: '720px',
  maxWidthL: '1096px',
  maxWidthXL: '1680px',

  spaceOuter: '64px',
  spaceXS: '4px',
  spaceS: '8px',
  spaceM: '16px',
  spaceL: '24px',
  spaceXL: '32px',
  space2XL: '48px',
  space3XL: '64px',
  space4XL: '96px',
  space5XL: '128px',

  zIndex0: 0,
  zIndex1: 4,
  zIndex2: 8,
  zIndex3: 16,
  zIndex4: 32,
  zIndex5: 64,
};

/** Tokens that change with viewport size */
const tokensDesktop = {
  fontSizeH0: pxToRem(120),
  fontSizeH1: pxToRem(80),
};

const tokensLaptop = {
  maxWidthS: '480px',
  maxWidthM: '640px',
  maxWidthL: '1000px',
  maxWidthXL: '1100px',
  spaceOuter: '48px',
  fontSizeH0: pxToRem(100),
  fontSizeH1: pxToRem(70),
  fontSizeH2: pxToRem(50),
  fontSizeH3: pxToRem(36),
  fontSizeH4: pxToRem(26),
  fontSizeH5: pxToRem(22),
};

const tokensTablet = {
  fontSizeH0: pxToRem(80),
  fontSizeH1: pxToRem(60),
  fontSizeH2: pxToRem(48),
  fontSizeH3: pxToRem(32),
  fontSizeH4: pxToRem(24),
  fontSizeH5: pxToRem(20),
};

const tokensMobile = {
  spaceOuter: '24px',
  fontSizeH0: pxToRem(54),
  fontSizeH1: pxToRem(40),
  fontSizeH2: pxToRem(34),
  fontSizeH3: pxToRem(28),
  fontSizeH4: pxToRem(22),
  fontSizeH5: pxToRem(18),
  fontSizeBodyL: pxToRem(17),
  fontSizeBodyM: pxToRem(16),
  fontSizeBodyS: pxToRem(14),
};

const tokensMobileSmall = {
  spaceOuter: '16px',
  fontSizeH0: pxToRem(42),
  fontSizeH1: pxToRem(36),
  fontSizeH2: pxToRem(28),
  fontSizeH3: pxToRem(24),
  fontSizeH4: pxToRem(20),
};

/**
 * Theme colours.
 *
 * `primary` is the working colour — links, buttons, rules, indices.
 * `accent` is the reveal colour — wipes, highlights, the live edge of things.
 * `signal` is warm and rationed: it marks the one number that matters.
 */
const dark = {
  background: 'oklch(17.5% 0.012 248)',
  backgroundLight: 'oklch(21.5% 0.014 248)',
  primary: 'oklch(72% 0.142 234)',
  accent: 'oklch(84% 0.128 196)',
  signal: 'oklch(80% 0.142 62)',
  error: 'oklch(66% 0.24 20)',
  text: 'var(--white)',
  textTitle: 'var(--text)',
  textBody: 'color-mix(in lab, var(--text) 80%, transparent)',
  textLight: 'color-mix(in lab, var(--text) 58%, transparent)',
  hairline: 'color-mix(in lab, var(--text) 12%, transparent)',
};

const light = {
  background: 'oklch(96.4% 0.004 248)',
  backgroundLight: 'oklch(99.2% 0.002 248)',
  primary: 'oklch(32% 0.06 250)',
  accent: 'oklch(70% 0.112 198)',
  signal: 'oklch(58% 0.14 55)',
  error: 'oklch(58% 0.22 25)',
  text: 'oklch(16% 0.015 250)',
  textTitle: 'color-mix(in lab, var(--text) 92%, transparent)',
  textBody: 'color-mix(in lab, var(--text) 76%, transparent)',
  textLight: 'color-mix(in lab, var(--text) 55%, transparent)',
  hairline: 'color-mix(in lab, var(--text) 14%, transparent)',
};

/**
 * sRGB equivalents of the theme colours, for consumers that can't parse
 * oklch — currently the WebGL layer. Kept next to the source values so the
 * two stay in step; regenerate with the Oklab matrices if the palette moves.
 */
export const glColors = {
  dark: {
    background: '#0c1116',
    primary: '#26b2ef',
    accent: '#45e4e6',
    signal: '#fea754',
  },
  light: {
    background: '#f1f3f6',
    primary: '#193550',
    accent: '#00b6bb',
    signal: '#b75f0b',
  },
} as const;

export const tokens = {
  base: baseTokens,
  desktop: tokensDesktop,
  laptop: tokensLaptop,
  tablet: tokensTablet,
  mobile: tokensMobile,
  mobileS: tokensMobileSmall,
};

export const themes = { dark, light };

export type ThemeName = keyof typeof themes;
