import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import ThemeToggle from './components/ThemeToggle';
import Home from './pages/Home';
import History from './pages/History';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <Navigation />
          <ThemeToggle />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;