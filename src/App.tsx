import { useEffect, useState } from 'react'
import { useTheme } from './contexts/ThemeContext'
import { useHabitStore } from './store/habitStore'
import Header from './components/Header'
import HabitList from './components/HabitList'
import AddHabitModal from './components/AddHabitModal'
import Stats from './components/Stats'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'

function App() {
  const { theme } = useTheme()
  const { habits, loadHabits } = useHabitStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  
  useEffect(() => {
    loadHabits()
  }, [loadHabits])
  
  useEffect(() => {
    // Show confetti when all habits for today are completed
    const allHabitsForToday = habits.filter(habit => 
      habit.frequency.includes(new Date().getDay())
    )
    
    const allCompleted = allHabitsForToday.length > 0 && 
      allHabitsForToday.every(habit => 
        habit.completedDates.includes(new Date().toISOString().split('T')[0])
      )
    
    if (allCompleted) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [habits])

  return (
    <div className={theme}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
        <Header />
        
        <main className="max-w-5xl mx-auto mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Habits</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Habit
                </button>
              </div>
              
              <HabitList />
              
              {habits.length === 0 && (
                <div className="card p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No habits yet</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Start by adding your first habit to track
                  </p>
                  <button 
                    className="btn btn-primary mt-4"
                    onClick={() => setShowAddModal(true)}
                  >
                    Add Your First Habit
                  </button>
                </div>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Stats />
            </motion.div>
          </div>
        </main>
      </div>
      
      {showAddModal && (
        <AddHabitModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}

export default App
