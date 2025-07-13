import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, type User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for auth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Handle OAuth callback
      authService.handleAuthCallback(token).then((result) => {
        if (result.success && result.user) {
          setUser(result.user);
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        setIsLoading(false);
      });
    } else {
      // Check if user is already authenticated
      refreshUser();
    }
  }, []);

  const login = () => {
    authService.loginWithGoogle();
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserPreferences = async (preferences: Partial<User['preferences']>): Promise<boolean> => {
    try {
      const success = await authService.updatePreferences(preferences);
      if (success && user) {
        setUser({
          ...user,
          preferences: { ...user.preferences, ...preferences }
        });
      }
      return success;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUserPreferences,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};