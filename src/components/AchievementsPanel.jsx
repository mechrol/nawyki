import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Flame, Target, Calendar, Zap } from 'lucide-react'

const AchievementsPanel = ({ achievements, detailed = false }) => {
  const achievementIcons = {
    'first-habit': Target,
    'streak-master': Flame,
    'week-warrior': Calendar,
    'habit-collector': Star,
    'consistency-king': Trophy,
    'level-up': Zap
  }

  const recentAchievements = detailed ? achievements : achievements.slice(0, 3)

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {detailed ? 'All Achievements' : 'Recent Achievements'}
        </h3>
        <Trophy className="w-5 h-5 text-yellow-500" />
      </div>

      <div className={`space-y-3 ${detailed ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : ''}`}>
        {recentAchievements.map((achievement, index) => {
          const IconComponent = achievementIcons[achievement.id] || Trophy
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 glass rounded-xl ${detailed ? '' : 'flex items-center space-x-3'}`}
            >
              <div className={`${detailed ? 'flex items-center space-x-3 mb-2' : 'flex-shrink-0'}`}>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                {detailed && (
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {achievement.description}
                    </p>
                  </div>
                )}
              </div>
              
              {!detailed && (
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 dark:text-white truncate">
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {achievement.description}
                  </p>
                </div>
              )}

              {detailed && (
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    achievement.unlocked 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {achievement.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {!detailed && achievements.length > 3 && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            +{achievements.length - 3} more achievements
          </span>
        </div>
      )}

      {achievements.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            Complete habits to unlock achievements!
          </p>
        </div>
      )}
    </div>
  )
}

export default AchievementsPanel
