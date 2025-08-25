import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import RemindersPage from './pages/RemindersPage';
import FriendsPage from './pages/FriendsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './auth/auth';
import VirtualCallOverlay from './components/VirtualCallOverlay';
import { useVirtualCalling } from './hooks/useVirtualCalling';

const AppWithCalling = () => {
  const {
    activeCall,
    answerCall,
    dismissCall,
    snoozeCall,
    isCallActive
  } = useVirtualCalling();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected app routes */}
          <Route path="/" element={
            // <ProtectedRoute>
              <AppLayout />
            // </ProtectedRoute>
          }>
            <Route index element={<HomePage />} />
            <Route path="reminders" element={<RemindersPage />} />
            <Route path="friends" element={<FriendsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* Virtual Call Overlay */}
      <VirtualCallOverlay
        isVisible={isCallActive}
        reminder={activeCall}
        onAnswer={answerCall}
        onDismiss={dismissCall}
        onSnooze={snoozeCall}
      />
    </>
  );
};
function App() {
  return (
    <AuthProvider>
      <AppWithCalling />
    </AuthProvider>
  );
}

export default App;
