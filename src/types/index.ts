export type HabitCategory = 'health' | 'productivity' | 'fitness' | 'mindfulness' | 'learning' | 'other';

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: number; // days per week
  createdAt: string;
  completions: string[]; // array of ISO date strings
}

export interface HabitCompletion {
  date: string;
  completed: boolean;
}

export interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  getHabitStreak: (habit: Habit) => number;
  getHabitCompletionRate: (habit: Habit) => number;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
