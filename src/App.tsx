import React, { useEffect } from 'react'
import { useTheme } from './context/ThemeContext'
import Header from './components/Header'
import HabitList from './components/HabitList'
import AddHabitForm from './components/AddHabitForm'
import Dashboard from './components/Dashboard'
import { motion } from 'framer-motion'
import { useHabit } from './context/HabitContext'

function App() {
  const { theme } = useTheme()
  const { habits } = useHabit()

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme
  }, [theme])

  return (
    <div className="app-container">
      <Header />
      <main>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {habits.length > 0 && <Dashboard />}
          <AddHabitForm />
          <HabitList />
        </motion.div>
      </main>
      <footer>
        <p>Habit Tracker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
