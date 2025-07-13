import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import RemindersPage from './pages/RemindersPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';


function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const initializeApp = async () => {
      // Add any initialization logic here
      // For example: loading user preferences, checking permissions, etc.
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsReady(true);
    };

    initializeApp();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash || !isReady) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Router>
      <Routes>
        {/* App routes with layout */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
        </Route>
        
        {/* Redirect any unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;