import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Zap, Trophy, Target } from 'lucide-react'

const Header = ({ theme, toggleTheme, userStats }) => {
  return (
    <header className="glass border-b border-white/20 dark:border-white/10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">HabitFlow</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Build better habits, one day at a time</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-6">
            {/* User Stats */}
            <motion.div 
              className="hidden md:flex items-center space-x-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="glass-card px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Level {userStats.level}
                  </span>
                </div>
              </div>
              <div className="glass-card px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {userStats.totalXP} XP
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="glass-card p-3 hover:scale-105 transition-transform duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
