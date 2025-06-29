import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Target } from 'lucide-react'
import HabitCard from './HabitCard'

const HabitGrid = ({ habits, onToggleHabit, onDeleteHabit, onUpdateHabit, onAddHabit }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Today's Habits
        </h2>
        <motion.button
          onClick={onAddHabit}
          className="glass-card px-6 py-3 flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Habit</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <HabitCard
              habit={habit}
              onToggle={() => onToggleHabit(habit.id)}
              onDelete={() => onDeleteHabit(habit.id)}
              onUpdate={(updates) => onUpdateHabit(habit.id, updates)}
            />
          </motion.div>
        ))}
      </div>

      {habits.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <Target className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Start Your Journey
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Create your first habit and begin building a better you, one day at a time.
          </p>
          <button
            onClick={onAddHabit}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          >
            Create First Habit
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default HabitGrid
