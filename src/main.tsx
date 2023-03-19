import Root from 'components/Root';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/variable.css';
import '@fontsource/ia-writer-mono';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
