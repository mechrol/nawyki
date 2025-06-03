import { useState } from 'react'
import { useHabitStore, Habit } from '../store/habitStore'
import { FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { 
  FiActivity, FiBook, FiCoffee, FiDroplet, FiHeart, 
  FiMusic, FiSun, FiTarget, FiTrendingUp, FiWifi 
} from 'react-icons/fi'

interface EditHabitModalProps {
  habit: Habit
  onClose: () => void
}

const COLORS = [
  '#4F46E5', // primary-600
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EC4899', // pink-500
  '#8B5CF6', // violet-500
  '#EF4444', // red-500
  '#3B82F6', // blue-500
  '#14B8A6', // teal-500
  '#F97316', // orange-500
  '#6366F1', // indigo-500
]

const ICONS = [
  { icon: FiActivity, name: 'Activity' },
  { icon: FiBook, name: 'Book' },
  { icon: FiCoffee, name: 'Coffee' },
  { icon: FiDroplet, name: 'Water' },
  { icon: FiHeart, name: 'Heart' },
  { icon: FiMusic, name: 'Music' },
  { icon: FiSun, name: 'Sun' },
  { icon: FiTarget, name: 'Target' },
  { icon: FiTrendingUp, name: 'Trend' },
  { icon: FiWifi, name: 'Wifi' },
]

const DAYS = [
  { value: 1, label: 'M' },
  { value: 2, label: 'T' },
  { value: 3, label: 'W' },
  { value: 4, label: 'T' },
  { value: 5, label: 'F' },
  { value: 6, label: 'S' },
  { value: 0, label: 'S' },
]

const EditHabitModal = ({ habit, onClose }: EditHabitModalProps) => {
  const { editHabit } = useHabitStore()
  const [name, setName] = useState(habit.name)
  const [description, setDescription] = useState(habit.description)
  const [frequency, setFrequency] = useState<number[]>(habit.frequency)
  const [color, setColor] = useState(habit.color)
  const [icon, setIcon] = useState(habit.icon)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return
    
    editHabit(habit.id, {
      name,
      description,
      frequency,
      color,
      icon,
    })
    
    onClose()
  }
  
  const toggleDay = (day: number) => {
    if (frequency.includes(day)) {
      setFrequency(frequency.filter(d => d !== day))
    } else {
      setFrequency([...frequency, day])
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold">Edit Habit</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Habit Name
            </label>
            <input
              type="text"
              id="name"
              className="input"
              placeholder="e.g., Drink water"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              className="input"
              placeholder="e.g., Drink 8 glasses of water daily"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Frequency
            </label>
            <div className="flex space-x-2">
              {DAYS.map(day => (
                <button
                  key={day.value}
                  type="button"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    frequency.includes(day.value)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map((i) => {
                const IconComponent = i.icon
                return (
                  <button
                    key={i.name}
                    type="button"
                    className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                      icon === i.name
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => setIcon(i.name)}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              className="btn btn-secondary flex-1"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={!name.trim() || frequency.length === 0}
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default EditHabitModal
