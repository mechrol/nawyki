import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'

const AddHabitModal = ({ isOpen, onClose, onAddHabit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'health',
    difficulty: 'medium',
    frequency: 'daily',
    description: ''
  })

  const categories = [
    { id: 'health', label: 'Health & Fitness', emoji: '💪' },
    { id: 'productivity', label: 'Productivity', emoji: '⚡' },
    { id: 'mindfulness', label: 'Mindfulness', emoji: '🧘' },
    { id: 'learning', label: 'Learning', emoji: '📚' },
    { id: 'social', label: 'Social', emoji: '👥' },
    { id: 'creativity', label: 'Creativity', emoji: '🎨' },
    { id: 'finance', label: 'Finance', emoji: '💰' },
    { id: 'other', label: 'Other', emoji: '🎯' }
  ]

  const difficulties = [
    { id: 'easy', label: 'Easy', color: 'from-green-400 to-emerald-500' },
    { id: 'medium', label: 'Medium', color: 'from-yellow-400 to-orange-500' },
    { id: 'hard', label: 'Hard', color: 'from-red-400 to-pink-500' }
  ]

  const frequencies = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'weekdays', label: 'Weekdays Only' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onAddHabit({
        ...formData,
        name: formData.name.trim()
      })
      setFormData({
        name: '',
        category: 'health',
        difficulty: 'medium',
        frequency: 'daily',
        description: ''
      })
      onClose()
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-card p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">Create New Habit</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Habit Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Drink 8 glasses of water"
                  className="w-full px-4 py-3 glass rounded-xl border border-white/30 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleChange('category', category.id)}
                      className={`p-3 rounded-xl text-left transition-all duration-200 ${
                        formData.category === category.id
                          ? 'bg-blue-500/20 border-2 border-blue-500'
                          : 'glass border border-white/30 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{category.emoji}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {category.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                  Difficulty
                </label>
                <div className="flex space-x-2">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty.id}
                      type="button"
                      onClick={() => handleChange('difficulty', difficulty.id)}
                      className={`flex-1 p-3 rounded-xl font-medium transition-all duration-200 ${
                        formData.difficulty === difficulty.id
                          ? `bg-gradient-to-r ${difficulty.color} text-white shadow-lg`
                          : 'glass border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10'
                      }`}
                    >
                      {difficulty.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                  Frequency
                </label>
                <div className="space-y-2">
                  {frequencies.map((frequency) => (
                    <button
                      key={frequency.id}
                      type="button"
                      onClick={() => handleChange('frequency', frequency.id)}
                      className={`w-full p-3 rounded-xl text-left font-medium transition-all duration-200 ${
                        formData.frequency === frequency.id
                          ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'glass border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10'
                      }`}
                    >
                      {frequency.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Why is this habit important to you?"
                  rows={3}
                  className="w-full px-4 py-3 glass rounded-xl border border-white/30 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Create Habit</span>
                </div>
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddHabitModal
