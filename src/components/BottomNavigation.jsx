import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, BellRing, User, Settings, Crown, MessageCircle, Users } from 'lucide-react';

const BottomNavigation = () => {
  const navItems = [
    { to: '/', icon: MessageCircle, label: 'Chat' },
    { to: '/reminders', icon: Calendar, label: 'Reminders' },
    { to: '/friends', icon: Users, label: 'Friends' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/subscription', icon: Crown, label: 'Pro' },
  ];

  return (
    <nav className=" bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 z-50 transition-colors duration-200">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;