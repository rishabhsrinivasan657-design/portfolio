import { createContext, useContext, type ElementType, type ReactNode } from 'react';
import { classes } from '~/utils/style';
import type { ThemeName } from './theme';

type ThemeContextValue = {
  theme: ThemeName;
  toggleTheme: (theme?: ThemeName) => void;
};

export const ThemeContext = createContext<Partial<ThemeContextValue>>({});

type ThemeProviderProps = {
  theme?: ThemeName;
  children: ReactNode;
  className?: string;
  as?: ElementType;
  toggleTheme?: (theme?: ThemeName) => void;
  'data-invert'?: boolean;
  id?: string;
};

/**
 * Provides the current theme. The root provider only supplies context — the
 * `data-theme` attribute lives on `<body>`. Nested providers render an element
 * so a section can invert the palette against the rest of the page.
 */
export const ThemeProvider = ({
  theme = 'dark',
  children,
  className,
  as: Component = 'div',
  toggleTheme,
  ...rest
}: ThemeProviderProps) => {
  const parentTheme = useTheme();
  const isRootProvider = !parentTheme.theme;

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme: toggleTheme || parentTheme.toggleTheme }}
    >
      {isRootProvider && children}
      {!isRootProvider && (
        <Component className={classes(className)} data-theme={theme} {...rest}>
          {children}
        </Component>
      )}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext) as ThemeContextValue;
}
