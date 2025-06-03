import { useState } from 'react'
import { useHabitStore, Habit } from '../store/habitStore'
import { format } from 'date-fns'
import { FiCheck, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi'
import { motion } from 'framer-motion'
import EditHabitModal from './EditHabitModal'

interface HabitItemProps {
  habit: Habit
  weekDays: {
    date: Date
    dayName: string
    dayNumber: string
    isToday: boolean
  }[]
}

const HabitItem = ({ habit, weekDays }: HabitItemProps) => {
  const { toggleHabit, deleteHabit } = useHabitStore()
  const [showMenu, setShowMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  
  const handleToggle = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    toggleHabit(habit.id, dateStr)
  }
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habit.id)
    }
    setShowMenu(false)
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
  
  return (
    <motion.div 
      className="py-4 px-4 relative"
      variants={item}
    >
      <div className="grid grid-cols-8 gap-2 items-center">
        <div className="col-span-1 flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: habit.color }}
          ></div>
          <div className="font-medium truncate">{habit.name}</div>
        </div>
        
        {weekDays.map((day, index) => {
          const dateStr = format(day.date, 'yyyy-MM-dd')
          const isCompleted = habit.completedDates.includes(dateStr)
          const shouldComplete = habit.frequency.includes(day.date.getDay())
          
          return (
            <div key={index} className="col-span-1 flex justify-center">
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isCompleted 
                    ? `bg-${habit.color} text-white` 
                    : shouldComplete 
                      ? 'border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500' 
                      : 'border-2 border-gray-200 dark:border-gray-700 opacity-50'
                }`}
                onClick={() => shouldComplete && handleToggle(day.date)}
                disabled={!shouldComplete}
                style={{ 
                  backgroundColor: isCompleted ? habit.color : 'transparent',
                  borderColor: isCompleted ? habit.color : undefined
                }}
              >
                {isCompleted && <FiCheck className="w-4 h-4" />}
              </button>
            </div>
          )
        })}
      </div>
      
      <div className="absolute right-4 top-4">
        <button 
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FiMoreVertical />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1 border dark:border-gray-700">
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={() => {
                setShowEditModal(true)
                setShowMenu(false)
              }}
            >
              <FiEdit2 className="mr-2" /> Edit
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={handleDelete}
            >
              <FiTrash2 className="mr-2" /> Delete
            </button>
          </div>
        )}
      </div>
      
      {showEditModal && (
        <EditHabitModal 
          habit={habit} 
          onClose={() => setShowEditModal(false)} 
        />
      )}
    </motion.div>
  )
}

export default HabitItem
