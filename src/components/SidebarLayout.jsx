import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Settings, 
  Crown, 
  MessageCircle, 
  Menu, 
  X, 
  LogOut,
  Bell,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../auth/auth';
import Logo from '../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarOpenSelector, userSelector } from '../store/global.Selctor';
import { setUser, toggleSidebar } from '../store/global.Slice';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const isOpen = useSelector(sidebarOpenSelector)
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useSelector(userSelector)

  const navItems = [
    { to: '/', icon: MessageCircle, label: 'Chat Assistant', color: 'text-blue-500' },
    { to: '/reminders', icon: Calendar, label: 'Reminders', color: 'text-green-500' },
    { to: '/profile', icon: User, label: 'Profile', color: 'text-purple-500' },
    { to: '/settings', icon: Settings, label: 'Settings', color: 'text-gray-500' },
    { to: '/subscription', icon: Crown, label: 'Pro Plan', color: 'text-yellow-500' },
  ];

  const handleLogout = async () => {
    dispatch(setUser(null));
    await logout();
    navigate('/login');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {
            dispatch(toggleSidebar())
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
              <img src={Logo} className='w-12 h-12' />
                <span className="text-xl text-orange-600 font-extrabold dark:text-gray-100">
                  TimeTuneAi
                </span>
              </div>
              
            )}
            
            <div className="flex items-center space-x-2">
              {/* Collapse Toggle (Desktop) */}
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              
              {/* Close Button (Mobile) */}
              <button
                onClick={() => {
                    dispatch(toggleSidebar())
                }}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(({ to, icon: Icon, label, color }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => {
                  // Close mobile sidebar when navigating
                  if (window.innerWidth < 1024) {
                    dispatch(toggleSidebar())
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-orange-500'
                  }`
                }
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${color} group-hover:scale-110 transition-transform`} />
                {!isCollapsed && (
                  <span className="font-medium truncate">{label}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Quick Actions */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  {theme === 'light' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                  <span className="text-sm">
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </button>
                
                {/* <button className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm">Notifications</span>
                </button> */}
              </div>
            </div>
          )}

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {!isCollapsed ? (
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center space-x-3 px-3 py-2">
                 

                  <img src={user?.picture} className="w-12 h-12 rounded-full "  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {user?.name || 'Anonymous User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      Pro Plan
                    </p>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Collapsed User Avatar */}
                <img src={user?.picture} className="w-12 h-12 rounded-full mx-auto"  />
                
                {/* Collapsed Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 flex justify-center"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;