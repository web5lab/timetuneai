import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { RemindersProvider } from './contexts/RemindersContext.jsx';
import { notificationService } from './services/notificationService.js';
import { Provider } from 'react-redux';
import { store, persistor } from './store/index.jsx';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';

// Initialize notification service
notificationService.initialize().then(() => {
  notificationService.createNotificationChannel();
});

// Initialize Android call service for native platforms
import { androidCallService } from './services/androidCallService';
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  androidCallService.initialize().then(() => {
    androidCallService.createVirtualCallChannel();
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RemindersProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
            <Toaster position='bottom-left' />
          </PersistGate>
        </Provider>
      </RemindersProvider>
    </ThemeProvider>
  </StrictMode>
);


