import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userSelector } from '../store/global.Selctor';

const ProtectedRoute = ({ children }) => {
  const user = useSelector(userSelector);

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
