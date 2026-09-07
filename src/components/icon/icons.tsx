import type { ReactNode } from 'react';

type IconDef = {
  /** Line icons stroke; brand marks fill. */
  mode: 'stroke' | 'fill';
  viewBox?: string;
  content: ReactNode;
};

/**
 * Icons are inlined rather than loaded from an SVG sprite so they never
 * depend on the deployed base path, and so `<use>` cross-document quirks
 * can't bite on GitHub Pages.
 */
export const icons = {
  'arrow-right': {
    mode: 'stroke',
    content: (
      <>
        <path d="M4 12h15" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),
  },
  'arrow-left': {
    mode: 'stroke',
    content: (
      <>
        <path d="M20 12H5" />
        <path d="M11 6l-6 6 6 6" />
      </>
    ),
  },
  'chevron-right': {
    mode: 'stroke',
    content: <path d="M9 5l7 7-7 7" />,
  },
  'arrow-down': {
    mode: 'stroke',
    content: (
      <>
        <path d="M12 4v15" />
        <path d="M6 13l6 6 6-6" />
      </>
    ),
  },
  close: {
    mode: 'stroke',
    content: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
      </>
    ),
  },
  menu: {
    mode: 'stroke',
    content: (
      <>
        <path d="M3 7h18" />
        <path d="M3 12h18" />
        <path d="M3 17h18" />
      </>
    ),
  },
  mail: {
    mode: 'stroke',
    content: (
      <>
        <rect x="2.5" y="5" width="19" height="14" />
        <path d="M2.5 6.5L12 13l9.5-6.5" />
      </>
    ),
  },
  send: {
    mode: 'stroke',
    content: (
      <>
        <path d="M21 3L10.5 13.5" />
        <path d="M21 3l-6.8 18-3.7-7.5L3 9.8 21 3z" />
      </>
    ),
  },
  download: {
    mode: 'stroke',
    content: (
      <>
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M4 20h16" />
      </>
    ),
  },
  external: {
    mode: 'stroke',
    content: (
      <>
        <path d="M14 4h6v6" />
        <path d="M20 4l-9 9" />
        <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
      </>
    ),
  },
  play: {
    mode: 'fill',
    content: <path d="M7 4.5v15l13-7.5-13-7.5z" />,
  },
  pause: {
    mode: 'fill',
    content: (
      <>
        <rect x="6" y="4.5" width="4" height="15" />
        <rect x="14" y="4.5" width="4" height="15" />
      </>
    ),
  },
  check: {
    mode: 'stroke',
    content: <path d="M4 12.5l5 5L20 6.5" />,
  },
  github: {
    mode: 'fill',
    content: (
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    ),
  },
  linkedin: {
    mode: 'fill',
    content: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    ),
  },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof icons;
