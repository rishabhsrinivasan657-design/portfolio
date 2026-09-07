import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { ThemeProvider, type ThemeName } from '~/components/theme';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Navbar } from '~/layouts/navbar';
import { Home } from '~/routes/home';
import styles from './app.module.css';

const ProjectRoute = lazy(() =>
  import('~/routes/project').then(module => ({ default: module.ProjectRoute }))
);
const NotFound = lazy(() =>
  import('~/routes/not-found').then(module => ({ default: module.NotFound }))
);

const THEME_KEY = 'theme';

function getInitialTheme(): ThemeName {
  if (typeof document === 'undefined') return 'dark';
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'light' ? 'light' : 'dark';
}

/**
 * Restores scroll position on navigation. Hash targets are left alone — the
 * nav handles those with a smooth scroll of its own.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}

export const App = () => {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  const toggleTheme = useCallback((newTheme?: ThemeName) => {
    setTheme(current => {
      const next = newTheme ?? (current === 'dark' ? 'light' : 'dark');
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // Private browsing modes can refuse writes; the theme still applies
        // for this session.
      }
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;

    const meta =
      document.querySelector('meta[name="theme-color"]') ??
      document.head.appendChild(
        Object.assign(document.createElement('meta'), { name: 'theme-color' })
      );
    meta.setAttribute('content', theme === 'light' ? '#f1f3f6' : '#0c1116');
  }, [theme]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
        <ScrollManager />
        <VisuallyHidden showOnFocus as="a" className={styles.skip} href="#main-content">
          Skip to main content
        </VisuallyHidden>
        <Navbar />
        <main id="main-content" className={styles.container} tabIndex={-1}>
          <Suspense fallback={<div className={styles.routeFallback} />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:slug" element={<ProjectRoute />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </ThemeProvider>
    </BrowserRouter>
  );
};
