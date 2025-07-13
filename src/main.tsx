import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { RemindersProvider } from './contexts/RemindersContext';
import { CalendarProvider } from './contexts/CalendarContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RemindersProvider>
        <CalendarProvider>
          <App />
        </CalendarProvider>
      </RemindersProvider>
    </ThemeProvider>
  </StrictMode>
);
