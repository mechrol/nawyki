import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Flame, MoreVertical, Edit2, Trash2, Calendar } from 'lucide-react'
import { format, isToday } from 'date-fns'

const HabitCard = ({ habit, onToggle, onDelete, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(habit.name)

  const today = format(new Date(), 'yyyy-MM-dd')
  const isCompleted = habit.completedDates.includes(today)
  const currentStreak = habit.currentStreak || 0

  const difficultyColors = {
    easy: 'from-green-400 to-emerald-500',
    medium: 'from-yellow-400 to-orange-500',
    hard: 'from-red-400 to-pink-500'
  }

  const categoryEmojis = {
    health: '💪',
    productivity: '⚡',
    mindfulness: '🧘',
    learning: '📚',
    social: '👥',
    creativity: '🎨',
    finance: '💰',
    other: '🎯'
  }

  const handleEdit = () => {
    if (isEditing) {
      onUpdate({ name: editName })
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
    setShowMenu(false)
  }

  const progressPercentage = Math.min((habit.completedDates.length / 30) * 100, 100)

  return (
    <motion.div
      className="glass-card p-6 relative overflow-hidden group"
      whileHover={{ y: -2 }}
      layout
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {categoryEmojis[habit.category] || '🎯'}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleEdit}
                onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                className="bg-transparent border-b border-white/30 text-lg font-semibold text-gray-800 dark:text-white focus:outline-none focus:border-blue-400"
                autoFocus
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {habit.name}
              </h3>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${difficultyColors[habit.difficulty]} text-white`}>
                {habit.difficulty}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {habit.frequency}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors duration-200"
          >
            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 glass-card p-2 min-w-[120px] z-20"
              >
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    onDelete()
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 progress-ring" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${progressPercentage * 2.51} 251`}
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Streak Counter */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={currentStreak > 0 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: currentStreak > 0 ? Infinity : 0, repeatDelay: 2 }}
          >
            <Flame className={`w-6 h-6 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
          </motion.div>
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            {currentStreak} day{currentStreak !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Complete Button */}
      <motion.button
        onClick={onToggle}
        className={`w-full py-4 rounded-xl font-medium transition-all duration-300 ${
          isCompleted
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
            : 'glass border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-400'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-center space-x-2">
          {isCompleted ? (
            <>
              <Check className="w-5 h-5" />
              <span>Completed Today!</span>
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              <span>Mark Complete</span>
            </>
          )}
        </div>
      </motion.button>

      {/* Last Completed */}
      {habit.completedDates.length > 0 && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Last completed: {isCompleted ? 'Today' : format(new Date(habit.completedDates[habit.completedDates.length - 1]), 'MMM d')}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default HabitCard
