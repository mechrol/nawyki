import { useState } from 'react'
import { useHabitStore } from '../store/habitStore'
import HabitItem from './HabitItem'
import { format, startOfWeek, addDays } from 'date-fns'
import { motion } from 'framer-motion'

const HabitList = () => {
  const { habits } = useHabitStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  // Generate week days for the header
  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 }) // Start from Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfCurrentWeek, i)
    return {
      date: day,
      dayName: format(day, 'EEE'),
      dayNumber: format(day, 'd'),
      isToday: format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    }
  })
  
  // Filter habits based on their frequency
  const filteredHabits = habits.filter(habit => {
    // Show all habits for now
    return true
  })
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  return (
    <div className="card">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="grid grid-cols-8 gap-2">
          <div className="col-span-1"></div>
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className={`col-span-1 text-center ${day.isToday ? 'font-bold text-primary-600' : ''}`}
            >
              <div className="text-sm">{day.dayName}</div>
              <div className={`text-lg ${day.isToday ? 'bg-primary-100 dark:bg-primary-900 rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
                {day.dayNumber}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {filteredHabits.length > 0 ? (
        <motion.div 
          className="divide-y dark:divide-gray-700"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredHabits.map(habit => (
            <HabitItem 
              key={habit.id} 
              habit={habit} 
              weekDays={weekDays}
            />
          ))}
        </motion.div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No habits to display</p>
        </div>
      )}
    </div>
  )
}

export default HabitList
