import InterVariable from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
import JetBrainsMonoVariable from '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2?url';
import SpaceGroteskVariable from '@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2?url';
import { media } from '~/utils/style';
import { themes, tokens } from './theme';

export const fontUrls = {
  display: SpaceGroteskVariable,
  body: InterVariable,
  mono: JetBrainsMonoVariable,
};

/** Squeeze out spaces and newlines */
function squish(styles: string) {
  return styles.replace(/\s\s+/g, ' ');
}

/** Transform a token object into CSS custom property declarations */
export function createThemeProperties(theme: Record<string, string | number>) {
  return squish(
    Object.keys(theme)
      .map(key => `--${key}: ${theme[key]};`)
      .join('\n')
  );
}

/** Transform a token object into a React style object */
export function createThemeStyleObject(theme: Record<string, string | number>) {
  const style: Record<string, string | number> = {};

  for (const key of Object.keys(theme)) {
    style[`--${key}`] = theme[key];
  }

  return style;
}

/** Re-declare the tokens that shift at each breakpoint */
function createMediaTokenProperties() {
  return squish(
    (Object.keys(media) as Array<keyof typeof media>)
      .map(
        key => `
        @media (max-width: ${media[key]}px) {
          :root { ${createThemeProperties(tokens[key])} }
        }
      `
      )
      .join('\n')
  );
}

const layerStyles = squish(`@layer theme, base, components, layout;`);

const tokenStyles = squish(`
  :root { ${createThemeProperties(tokens.base)} }

  ${createMediaTokenProperties()}

  [data-theme='dark'] { ${createThemeProperties(themes.dark)} }
  [data-theme='light'] { ${createThemeProperties(themes.light)} }
`);

const fontStyles = squish(`
  @font-face {
    font-family: 'Space Grotesk Variable';
    font-style: normal;
    font-weight: 300 700;
    font-display: block;
    src: url(${SpaceGroteskVariable}) format('woff2-variations');
  }

  @font-face {
    font-family: 'Inter Variable';
    font-style: normal;
    font-weight: 100 900;
    font-display: block;
    src: url(${InterVariable}) format('woff2-variations');
  }

  @font-face {
    font-family: 'JetBrains Mono Variable';
    font-style: normal;
    font-weight: 100 800;
    font-display: block;
    src: url(${JetBrainsMonoVariable}) format('woff2-variations');
  }
`);

export const themeStyles = squish(`
  ${layerStyles}

  @layer theme {
    ${tokenStyles}
    ${fontStyles}
  }
`);

/**
 * Inject the token + font stylesheet, and preload the two faces that are
 * needed for first paint. Called once from the entry module so the styles
 * land in `<head>` before React renders anything.
 */
export function installThemeStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('theme-styles')) return;

  for (const href of [SpaceGroteskVariable, InterVariable]) {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'font';
    preload.type = 'font/woff2';
    preload.crossOrigin = '';
    preload.href = href;
    document.head.appendChild(preload);
  }

  const style = document.createElement('style');
  style.id = 'theme-styles';
  style.textContent = themeStyles;
  document.head.appendChild(style);
}
