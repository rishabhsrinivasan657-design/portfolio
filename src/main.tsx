import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { installThemeStyles } from '~/components/theme';
import { App } from './app';
import './styles/reset.css';
import './styles/global.css';

// Tokens and font faces must be in `<head>` before React paints anything.
installThemeStyles();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
