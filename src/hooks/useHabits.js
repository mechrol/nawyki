import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export const useHabits = () => {
  const [habits, setHabits] = useState([])

  // Load habits from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habitTracker_habits')
    if (savedHabits) {
      try {
        const parsedHabits = JSON.parse(savedHabits)
        setHabits(parsedHabits)
      } catch (error) {
        console.error('Error parsing saved habits:', error)
        setHabits([])
      }
    } else {
      // Initialize with sample habits
      const sampleHabits = [
        {
          id: '1',
          name: 'Drink 8 glasses of water',
          category: 'health',
          difficulty: 'easy',
          frequency: 'daily',
          description: 'Stay hydrated throughout the day',
          completedDates: [format(new Date(), 'yyyy-MM-dd')],
          currentStreak: 1,
          longestStreak: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Read for 30 minutes',
          category: 'learning',
          difficulty: 'medium',
          frequency: 'daily',
          description: 'Expand knowledge through reading',
          completedDates: [],
          currentStreak: 0,
          longestStreak: 0,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Exercise for 45 minutes',
          category: 'health',
          difficulty: 'hard',
          frequency: 'daily',
          description: 'Maintain physical fitness',
          completedDates: [],
          currentStreak: 0,
          longestStreak: 0,
          createdAt: new Date().toISOString()
        }
      ]
      setHabits(sampleHabits)
    }
  }, [])

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem('habitTracker_habits', JSON.stringify(habits))
  }, [habits])

  const addHabit = (habitData) => {
    const newHabit = {
      id: Date.now().toString(),
      ...habitData,
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString()
    }
    setHabits(prev => [...prev, newHabit])
  }

  const updateHabit = (habitId, updates) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, ...updates } : habit
    ))
  }

  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId))
  }

  const calculateStreak = (completedDates) => {
    if (completedDates.length === 0) return 0

    const sortedDates = completedDates.sort((a, b) => new Date(b) - new Date(a))
    const today = format(new Date(), 'yyyy-MM-dd')
    
    let streak = 0
    let currentDate = new Date()

    // Check if today is completed
    if (sortedDates[0] === today) {
      streak = 1
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000) // Go back one day
    } else if (sortedDates[0] === format(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')) {
      // If yesterday was completed but not today, start from yesterday
      streak = 1
      currentDate = new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000) // Go back two days
    } else {
      return 0 // No recent completion
    }

    // Count consecutive days
    for (let i = 1; i < sortedDates.length; i++) {
      const expectedDate = format(currentDate, 'yyyy-MM-dd')
      if (sortedDates[i] === expectedDate) {
        streak++
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
      } else {
        break
      }
    }

    return streak
  }

  const toggleHabit = (habitId) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit

      const isCompleted = habit.completedDates.includes(today)
      let newCompletedDates

      if (isCompleted) {
        // Remove today's completion
        newCompletedDates = habit.completedDates.filter(date => date !== today)
      } else {
        // Add today's completion
        newCompletedDates = [...habit.completedDates, today]
      }

      const currentStreak = calculateStreak(newCompletedDates)
      const longestStreak = Math.max(habit.longestStreak || 0, currentStreak)

      return {
        ...habit,
        completedDates: newCompletedDates,
        currentStreak,
        longestStreak
      }
    }))
  }

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit
  }
}
