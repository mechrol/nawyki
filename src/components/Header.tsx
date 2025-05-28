import React from 'react';
import { FaMoon, FaSun, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header>
      <div className="logo">
        <FaCheckCircle size={24} />
        <span>HabitTracker</span>
      </div>
      <motion.button
        className="btn-icon"
        onClick={toggleTheme}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
      </motion.button>
    </header>
  );
};

export default Header;
