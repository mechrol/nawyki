import { create } from 'zustand'
import { format, parseISO, isToday, differenceInDays, isSameDay, addDays, subDays } from 'date-fns'

export interface Habit {
  id: string
  name: string
  description: string
  frequency: number[] // 0-6 for days of week (0 = Sunday)
  color: string
  icon: string
  createdAt: string
  completedDates: string[] // ISO date strings (YYYY-MM-DD)
  streak: number
  longestStreak: number
}

interface HabitStore {
  habits: Habit[]
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak' | 'longestStreak'>) => void
  toggleHabit: (id: string, date: string) => void
  deleteHabit: (id: string) => void
  editHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak' | 'longestStreak'>>) => void
  loadHabits: () => void
}

// Helper function to calculate streak
const calculateStreak = (completedDates: string[], frequency: number[]): number => {
  if (completedDates.length === 0) return 0
  
  // Sort dates in ascending order
  const sortedDates = [...completedDates].sort((a, b) => 
    parseISO(a).getTime() - parseISO(b).getTime()
  )
  
  // Get the most recent date
  const lastCompletedDate = parseISO(sortedDates[sortedDates.length - 1])
  
  // If the habit should be done today (based on frequency) and it's not done, streak is broken
  const today = new Date()
  const todayDayOfWeek = today.getDay()
  const shouldBeDoneToday = frequency.includes(todayDayOfWeek)
  const isDoneToday = sortedDates.some(date => isSameDay(parseISO(date), today))
  
  if (shouldBeDoneToday && !isDoneToday && !isSameDay(lastCompletedDate, today)) {
    // Check if it was done yesterday
    const yesterday = subDays(today, 1)
    const yesterdayDayOfWeek = yesterday.getDay()
    const shouldBeDoneYesterday = frequency.includes(yesterdayDayOfWeek)
    const isDoneYesterday = sortedDates.some(date => isSameDay(parseISO(date), yesterday))
    
    if (shouldBeDoneYesterday && !isDoneYesterday) {
      return 0 // Streak broken
    }
  }
  
  // Count backwards from the last completed date
  let currentDate = lastCompletedDate
  let streak = 0
  let daysBroken = 0
  
  while (true) {
    // Check if this date is completed
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const isCompleted = completedDates.includes(dateStr)
    const dayOfWeek = currentDate.getDay()
    const shouldBeDone = frequency.includes(dayOfWeek)
    
    // If this day should be done and it's not completed, break streak
    if (shouldBeDone && !isCompleted) {
      daysBroken++
      if (daysBroken > 1) break // Allow one day of grace period
    } else if (shouldBeDone && isCompleted) {
      streak++
      daysBroken = 0
    }
    
    // Move to previous day
    currentDate = subDays(currentDate, 1)
    
    // Stop if we're more than 30 days back (safety)
    if (differenceInDays(lastCompletedDate, currentDate) > 30) break
  }
  
  return streak
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  
  loadHabits: () => {
    const savedHabits = localStorage.getItem('habits')
    if (savedHabits) {
      set({ habits: JSON.parse(savedHabits) })
    }
  },
  
  addHabit: (habitData) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      ...habitData,
      createdAt: new Date().toISOString(),
      completedDates: [],
      streak: 0,
      longestStreak: 0
    }
    
    set(state => {
      const updatedHabits = [...state.habits, newHabit]
      localStorage.setItem('habits', JSON.stringify(updatedHabits))
      return { habits: updatedHabits }
    })
  },
  
  toggleHabit: (id, date) => {
    set(state => {
      const habitIndex = state.habits.findIndex(h => h.id === id)
      if (habitIndex === -1) return state
      
      const habit = state.habits[habitIndex]
      let completedDates = [...habit.completedDates]
      
      if (completedDates.includes(date)) {
        // Remove date if already completed
        completedDates = completedDates.filter(d => d !== date)
      } else {
        // Add date if not completed
        completedDates.push(date)
      }
      
      // Calculate new streak
      const streak = calculateStreak(completedDates, habit.frequency)
      const longestStreak = Math.max(habit.longestStreak, streak)
      
      const updatedHabit = {
        ...habit,
        completedDates,
        streak,
        longestStreak
      }
      
      const updatedHabits = [
        ...state.habits.slice(0, habitIndex),
        updatedHabit,
        ...state.habits.slice(habitIndex + 1)
      ]
      
      localStorage.setItem('habits', JSON.stringify(updatedHabits))
      return { habits: updatedHabits }
    })
  },
  
  deleteHabit: (id) => {
    set(state => {
      const updatedHabits = state.habits.filter(h => h.id !== id)
      localStorage.setItem('habits', JSON.stringify(updatedHabits))
      return { habits: updatedHabits }
    })
  },
  
  editHabit: (id, updates) => {
    set(state => {
      const habitIndex = state.habits.findIndex(h => h.id === id)
      if (habitIndex === -1) return state
      
      const updatedHabit = {
        ...state.habits[habitIndex],
        ...updates
      }
      
      const updatedHabits = [
        ...state.habits.slice(0, habitIndex),
        updatedHabit,
        ...state.habits.slice(habitIndex + 1)
      ]
      
      localStorage.setItem('habits', JSON.stringify(updatedHabits))
      return { habits: updatedHabits }
    })
  }
}))
