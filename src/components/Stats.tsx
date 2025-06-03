import { useHabitStore } from '../store/habitStore'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns'
import { FiAward, FiTrendingUp, FiCalendar } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Stats = () => {
  const { habits } = useHabitStore()
  
  // Calculate today's completion rate
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const todayDayOfWeek = today.getDay()
  
  const habitsForToday = habits.filter(habit => 
    habit.frequency.includes(todayDayOfWeek)
  )
  
  const completedToday = habitsForToday.filter(habit => 
    habit.completedDates.includes(todayStr)
  )
  
  const todayCompletionRate = habitsForToday.length > 0
    ? Math.round((completedToday.length / habitsForToday.length) * 100)
    : 0
  
  // Calculate weekly completion rate
  const weekStart = startOfWeek(today)
  const weekEnd = endOfWeek(today)
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })
  
  let totalWeeklyHabits = 0
  let completedWeeklyHabits = 0
  
  daysInWeek.forEach(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayOfWeek = day.getDay()
    
    const habitsForDay = habits.filter(habit => 
      habit.frequency.includes(dayOfWeek)
    )
    
    totalWeeklyHabits += habitsForDay.length
    
    habitsForDay.forEach(habit => {
      if (habit.completedDates.includes(dayStr)) {
        completedWeeklyHabits++
      }
    })
  })
  
  const weeklyCompletionRate = totalWeeklyHabits > 0
    ? Math.round((completedWeeklyHabits / totalWeeklyHabits) * 100)
    : 0
  
  // Find longest streak
  const longestStreak = habits.length > 0
    ? Math.max(...habits.map(habit => habit.longestStreak))
    : 0
  
  // Find current longest streak
  const currentLongestStreak = habits.length > 0
    ? Math.max(...habits.map(habit => habit.streak))
    : 0
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
      
      <div className="space-y-6">
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <FiCalendar className="mr-2" /> Today's Progress
          </h3>
          
          <div className="flex items-center">
            <div className="w-20 h-20 mr-4">
              <CircularProgressbar
                value={todayCompletionRate}
                text={`${todayCompletionRate}%`}
                styles={buildStyles({
                  textSize: '1.5rem',
                  pathColor: '#4F46E5',
                  textColor: '#4F46E5',
                  trailColor: '#E0E7FF',
                })}
              />
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {completedToday.length} of {habitsForToday.length} habits completed
              </p>
              
              {habitsForToday.length > 0 && todayCompletionRate < 100 && (
                <p className="text-sm font-medium text-primary-600 mt-1">
                  {habitsForToday.length - completedToday.length} habits remaining today
                </p>
              )}
              
              {todayCompletionRate === 100 && habitsForToday.length > 0 && (
                <p className="text-sm font-medium text-success-600 mt-1">
                  All done for today! 🎉
                </p>
              )}
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <FiTrendingUp className="mr-2" /> Weekly Overview
          </h3>
          
          <div className="flex items-center">
            <div className="w-20 h-20 mr-4">
              <CircularProgressbar
                value={weeklyCompletionRate}
                text={`${weeklyCompletionRate}%`}
                styles={buildStyles({
                  textSize: '1.5rem',
                  pathColor: '#10B981',
                  textColor: '#10B981',
                  trailColor: '#ECFDF5',
                })}
              />
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {completedWeeklyHabits} of {totalWeeklyHabits} weekly habits completed
              </p>
              
              <p className="text-sm font-medium mt-1">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <FiAward className="mr-2" /> Streaks
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-primary-600">{currentLongestStreak} days</p>
            </div>
            
            <div className="bg-success-50 dark:bg-success-600/10 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
              <p className="text-2xl font-bold text-success-600">{longestStreak} days</p>
            </div>
          </div>
          
          {habits.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Top Streaks</h4>
              <div className="space-y-2">
                {habits
                  .sort((a, b) => b.streak - a.streak)
                  .slice(0, 3)
                  .map(habit => (
                    <div key={habit.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: habit.color }}
                        ></div>
                        <span className="text-sm">{habit.name}</span>
                      </div>
                      <span className="text-sm font-medium">{habit.streak} days</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </motion.div>
        
        {habits.length > 0 && (
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-4">Motivational Quote</h3>
            <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-300">
              "Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them."
            </blockquote>
            <p className="text-right text-sm mt-2 text-gray-500 dark:text-gray-400">— James Clear, Atomic Habits</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Stats
