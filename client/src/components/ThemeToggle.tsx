import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 transform hover:scale-110 active:scale-95 hover:rotate-12"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform duration-200" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-200" />
      )}
    </button>
  );
};

export default ThemeToggle;
