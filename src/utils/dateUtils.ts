import { parseISO, format, isToday, isSameDay, differenceInDays, subDays } from 'date-fns';
import { Habit } from '../types';

export const formatDate = (date: string): string => {
  return format(parseISO(date), 'MMM d, yyyy');
};

export const isDateToday = (date: string): boolean => {
  return isToday(parseISO(date));
};

export const getLastNDays = (n: number): Date[] => {
  const result: Date[] = [];
  for (let i = 0; i < n; i++) {
    result.push(subDays(new Date(), i));
  }
  return result.reverse();
};

export const wasHabitCompletedOnDate = (habit: Habit, date: Date): boolean => {
  return habit.completions.some(completionDate => 
    isSameDay(parseISO(completionDate), date)
  );
};

export const calculateStreak = (completions: string[]): number => {
  if (completions.length === 0) return 0;
  
  // Sort completions by date (newest first)
  const sortedDates = [...completions]
    .map(date => parseISO(date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  // Check if today is completed
  const today = new Date();
  const hasTodayCompleted = sortedDates.some(date => isToday(date));
  
  // If today is not completed, check if yesterday was
  if (!hasTodayCompleted) {
    const yesterday = subDays(today, 1);
    const hasYesterdayCompleted = sortedDates.some(date => isSameDay(date, yesterday));
    
    // If yesterday wasn't completed either, streak is 0
    if (!hasYesterdayCompleted) return 0;
  }
  
  let streak = hasTodayCompleted ? 1 : 0;
  let currentDate = hasTodayCompleted ? subDays(today, 1) : today;
  
  // Count consecutive days
  for (let i = 0; i < sortedDates.length; i++) {
    const completionDate = sortedDates[i];
    
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
