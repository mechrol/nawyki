import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import HabitGrid from './components/HabitGrid'
import AddHabitModal from './components/AddHabitModal'
import StatsPanel from './components/StatsPanel'
import AchievementsPanel from './components/AchievementsPanel'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import { useHabits } from './hooks/useHabits'
import { useGameification } from './hooks/useGameification'
import { useTheme } from './hooks/useTheme'

function App() {
  const [activeTab, setActiveTab] = useState('habits')
  const [showAddModal, setShowAddModal] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { habits, addHabit, toggleHabit, deleteHabit, updateHabit } = useHabits()
  const { userStats, achievements, checkAchievements } = useGameification(habits)

  useEffect(() => {
    checkAchievements()
  }, [habits, checkAchievements])

  const tabs = [
    { id: 'habits', label: 'Habits', icon: '🎯' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' }
  ]

  return (
    <div className={`min-h-screen ${theme}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <Header 
          theme={theme} 
          toggleTheme={toggleTheme}
          userStats={userStats}
        />
        
        <main className="container mx-auto px-4 py-8">
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="glass-card p-2">
              <div className="flex space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-white/40 dark:bg-white/20 text-blue-600 dark:text-blue-400 shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'habits' && (
              <motion.div
                key="habits"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3">
                    <HabitGrid
                      habits={habits}
                      onToggleHabit={toggleHabit}
                      onDeleteHabit={deleteHabit}
                      onUpdateHabit={updateHabit}
                      onAddHabit={() => setShowAddModal(true)}
                    />
                  </div>
                  <div className="space-y-6">
                    <StatsPanel userStats={userStats} />
                    <AchievementsPanel achievements={achievements} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AnalyticsDashboard habits={habits} />
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AchievementsPanel achievements={achievements} detailed={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AddHabitModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddHabit={addHabit}
        />
      </div>
    </div>
  )
}

export default App
