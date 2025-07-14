import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SidebarLayout';

const AppLayout = () => {
  return (
    <div className="min-h-screen h-screen max-h-screen bg-gray-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;