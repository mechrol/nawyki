import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Zap, Trophy, Target } from 'lucide-react'

const StatsPanel = ({ userStats }) => {
  const stats = [
    {
      icon: Target,
      label: 'Total Habits',
      value: userStats.totalHabits,
      color: 'text-blue-500'
    },
    {
      icon: TrendingUp,
      label: 'Completion Rate',
      value: `${userStats.completionRate}%`,
      color: 'text-green-500'
    },
    {
      icon: Zap,
      label: 'Current Level',
      value: userStats.level,
      color: 'text-yellow-500'
    },
    {
      icon: Trophy,
      label: 'Total XP',
      value: userStats.totalXP,
      color: 'text-purple-500'
    }
  ]

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Your Progress
      </h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 glass rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.label}
              </span>
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-white">
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* XP Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Level Progress
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {userStats.xpToNextLevel} XP to next level
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${userStats.levelProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  )
}

export default StatsPanel
