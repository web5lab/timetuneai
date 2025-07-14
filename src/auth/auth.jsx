import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "test 12",
    name: "test user",
    email: "helloshiva0801@gmail.com",
  });

  const login = async () => {
    try {
      const result = await GoogleAuth.signIn();
      console.log('Login result:', result);
      setUser({
        id: "test 12",
        name: "test user",
        email: "helloshiva0801@gmail.com",
      });
    } catch (err) {
      console.error('Login error 1:', err);
    }
  };

  const logout = async () => {
    await GoogleAuth.signOut();
    setUser(null);
  };

  useEffect(() => {
    GoogleAuth.initialize(); // Optional (mainly for web)
    GoogleAuth.refresh().then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
