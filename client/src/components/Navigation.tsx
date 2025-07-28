import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, History, Mic } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Mic className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Speech to Text
            </h1>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                isActive('/') 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/history"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                isActive('/history') 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;