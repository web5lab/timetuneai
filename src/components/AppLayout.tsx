import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
     


        {/* Page Content */}
        <main className=" h-screen overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;