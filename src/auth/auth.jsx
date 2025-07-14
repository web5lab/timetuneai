import React, { createContext, useContext, useEffect } from 'react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../store/global.Selctor';
import { setUser } from '../store/global.Slice';
import { GetUserData } from '../store/global.Action';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector)

  const login = async () => {
    try {
      const result = await GoogleAuth.signIn();
      const idToken = result.authentication.idToken;
      dispatch(GetUserData(idToken));
      console.log('Login result:', result);
    } catch (err) {
      console.error('Login error 1:', err);
    }
  };

  const logout = async () => {
    await GoogleAuth.signOut();
    dispatch(setUser(null));
  };

  useEffect(() => {
    GoogleAuth.initialize(); // Optional (mainly for web)
    GoogleAuth.refresh().then(setUser).catch(() => dispatch(setUser(null)));
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
