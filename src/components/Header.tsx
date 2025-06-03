import { useTheme } from '../contexts/ThemeContext'
import { FiSun, FiMoon } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Header = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <header className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18Z" fill="white"/>
              <path d="M12 8C12.5523 8 13 8.44772 13 9V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V9C11 8.44772 11.4477 8 12 8Z" fill="white"/>
              <path d="M12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15Z" fill="white"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Momentum</h1>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </motion.button>
      </div>
      
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Build better habits, one day at a time
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Track your daily habits, build streaks, and visualize your progress to stay motivated and achieve your goals.
        </p>
      </motion.div>
    </header>
  )
}

export default Header
