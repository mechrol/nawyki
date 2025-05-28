import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitContextType } from '../types';
import { isToday, isSameDay, parseISO, subDays, differenceInDays, startOfDay } from 'date-fns';

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      completions: [],
    };
    setHabits(prevHabits => [...prevHabits, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
  };

  const toggleHabitCompletion = (id: string, date: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id !== id) return habit;
        
        const dateExists = habit.completions.includes(date);
        
        return {
          ...habit,
          completions: dateExists
            ? habit.completions.filter(d => d !== date)
            : [...habit.completions, date]
        };
      })
    );
  };

  const getHabitStreak = (habit: Habit): number => {
    if (habit.completions.length === 0) return 0;
    
    // Sort completions by date (newest first)
    const sortedCompletions = [...habit.completions]
      .map(date => parseISO(date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    // Check if today is completed
    const today = startOfDay(new Date());
    const hasTodayCompleted = sortedCompletions.some(date => isSameDay(date, today));
    
    // If today is not completed, check if yesterday was
    if (!hasTodayCompleted) {
      const yesterday = subDays(today, 1);
      const hasYesterdayCompleted = sortedCompletions.some(date => isSameDay(date, yesterday));
      
      // If yesterday wasn't completed either, streak is 0
      if (!hasYesterdayCompleted) return 0;
    }
    
    let streak = hasTodayCompleted ? 1 : 0;
    let currentDate = hasTodayCompleted ? subDays(today, 1) : today;
    
    // Count consecutive days
    for (let i = 0; i < sortedCompletions.length; i++) {
      const completionDate = startOfDay(sortedCompletions[i]);
      
      // If this date is the current date we're checking, increment streak
      if (isSameDay(completionDate, currentDate)) {
        if (!hasTodayCompleted || streak > 0) streak++;
        currentDate = subDays(currentDate, 1);
      } 
      // If we missed a day, break the streak count
      else if (differenceInDays(currentDate, completionDate) > 0) {
        break;
      }
    }
    
    return streak;
  };

  const getHabitCompletionRate = (habit: Habit): number => {
    if (habit.completions.length === 0) return 0;
    
    // Get days since habit creation
    const creationDate = parseISO(habit.createdAt);
    const today = new Date();
    const daysSinceCreation = Math.max(1, differenceInDays(today, creationDate) + 1);
    
    // Calculate expected completions based on frequency
    const expectedCompletions = Math.min(daysSinceCreation, habit.frequency * Math.ceil(daysSinceCreation / 7));
    
    // Get actual completions in the last period
    const recentCompletions = habit.completions.filter(date => {
      const completionDate = parseISO(date);
      return differenceInDays(today, completionDate) < 7;
    }).length;
    
    // Calculate completion rate (capped at 100%)
    return Math.min(100, Math.round((recentCompletions / habit.frequency) * 100));
  };

  return (
    <HabitContext.Provider value={{
      habits,
      addHabit,
      deleteHabit,
      toggleHabitCompletion,
      getHabitStreak,
      getHabitCompletionRate
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};
