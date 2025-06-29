import { useState, useEffect, useCallback } from 'react'

export const useGameification = (habits) => {
  const [userStats, setUserStats] = useState({
    level: 1,
    totalXP: 0,
    xpToNextLevel: 100,
    levelProgress: 0,
    totalHabits: 0,
    completionRate: 0
  })

  const [achievements, setAchievements] = useState([
    {
      id: 'first-habit',
      name: 'Getting Started',
      description: 'Create your first habit',
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Maintain a 7-day streak',
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Complete all habits for a week',
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'habit-collector',
      name: 'Habit Collector',
      description: 'Create 5 different habits',
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'consistency-king',
      name: 'Consistency King',
      description: 'Achieve 80% completion rate',
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'level-up',
      name: 'Level Up',
      description: 'Reach level 5',
      unlocked: false,
      unlockedAt: null
    }
  ])

  // Load achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem('habitTracker_achievements')
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements))
      } catch (error) {
        console.error('Error parsing saved achievements:', error)
      }
    }

    const savedStats = localStorage.getItem('habitTracker_userStats')
    if (savedStats) {
      try {
        setUserStats(JSON.parse(savedStats))
      } catch (error) {
        console.error('Error parsing saved user stats:', error)
      }
    }
  }, [])

  // Save to localStorage when achievements or stats change
  useEffect(() => {
    localStorage.setItem('habitTracker_achievements', JSON.stringify(achievements))
  }, [achievements])

  useEffect(() => {
    localStorage.setItem('habitTracker_userStats', JSON.stringify(userStats))
  }, [userStats])

  // Calculate XP based on habit difficulty
  const getXPForHabit = (difficulty) => {
    const xpMap = {
      easy: 10,
      medium: 20,
      hard: 30
    }
    return xpMap[difficulty] || 10
  }

  // Calculate level from total XP
  const calculateLevel = (totalXP) => {
    return Math.floor(totalXP / 100) + 1
  }

  // Calculate XP needed for next level
  const calculateXPToNextLevel = (totalXP) => {
    const currentLevel = calculateLevel(totalXP)
    const xpForNextLevel = currentLevel * 100
    return xpForNextLevel - totalXP
  }

  // Calculate level progress percentage
  const calculateLevelProgress = (totalXP) => {
    const currentLevel = calculateLevel(totalXP)
    const xpForCurrentLevel = (currentLevel - 1) * 100
    const xpForNextLevel = currentLevel * 100
    const progressXP = totalXP - xpForCurrentLevel
    return (progressXP / (xpForNextLevel - xpForCurrentLevel)) * 100
  }

  // Update user stats based on habits
  useEffect(() => {
    const totalCompletions = habits.reduce((total, habit) => total + habit.completedDates.length, 0)
    const totalXP = habits.reduce((total, habit) => {
      return total + (habit.completedDates.length * getXPForHabit(habit.difficulty))
    }, 0)

    const totalPossibleCompletions = habits.length * 30 // Assuming 30 days tracking
    const completionRate = totalPossibleCompletions > 0 
      ? Math.round((totalCompletions / totalPossibleCompletions) * 100)
      : 0

    setUserStats({
      level: calculateLevel(totalXP),
      totalXP,
      xpToNextLevel: calculateXPToNextLevel(totalXP),
      levelProgress: calculateLevelProgress(totalXP),
      totalHabits: habits.length,
      completionRate: Math.min(completionRate, 100)
    })
  }, [habits])

  // Check and unlock achievements
  const checkAchievements = useCallback(() => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.unlocked) return achievement

      let shouldUnlock = false

      switch (achievement.id) {
        case 'first-habit':
          shouldUnlock = habits.length >= 1
          break
        case 'streak-master':
          shouldUnlock = habits.some(habit => habit.currentStreak >= 7)
          break
        case 'week-warrior':
          // Check if all habits were completed for any 7-day period
          shouldUnlock = habits.length > 0 && habits.every(habit => habit.currentStreak >= 7)
          break
        case 'habit-collector':
          shouldUnlock = habits.length >= 5
          break
        case 'consistency-king':
          shouldUnlock = userStats.completionRate >= 80
          break
        case 'level-up':
          shouldUnlock = userStats.level >= 5
          break
        default:
          break
      }

      if (shouldUnlock) {
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        }
      }

      return achievement
    }))
  }, [habits, userStats])

  return {
    userStats,
    achievements,
    checkAchievements,
    getXPForHabit
  }
}
