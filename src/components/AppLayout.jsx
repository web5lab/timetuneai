import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const AppLayout = () => {

  return (
    <div className="min-h-screen h-screen max-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      <Outlet />
  
    </div>
  );
};

export default AppLayout;