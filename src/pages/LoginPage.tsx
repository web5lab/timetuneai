import React from 'react';
import { useAuth } from '../auth/auth';

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Login with Google</h1>
      <button
        onClick={login}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;
