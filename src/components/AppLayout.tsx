import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const AppLayout: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      {/* Page Content */}
      <main className="flex-1 overflow-hidden pb-16">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;