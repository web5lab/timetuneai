import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { RemindersProvider } from './contexts/RemindersContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RemindersProvider>
        <App />
      </RemindersProvider>
    </ThemeProvider>
  </StrictMode>
);
