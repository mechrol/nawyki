import { useState } from 'react';
import { Habit } from '../types';
import { useHabit } from '../context/HabitContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { format, parseISO, startOfDay, subDays, isSameDay } from 'date-fns';
import { FaFire, FaTrash, FaCheck, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface HabitCardProps {
  habit: Habit;
}

const HabitCard = ({ habit }: HabitCardProps) => {
  const { toggleHabitCompletion, deleteHabit, getHabitStreak, getHabitCompletionRate } = useHabit();
  const [showCalendar, setShowCalendar] = useState(false);
  
  const completionRate = getHabitCompletionRate(habit);
  const streak = getHabitStreak(habit);
  
  const today = startOfDay(new Date()).toISOString();
  const isCompletedToday = habit.completions.some(date => 
    isSameDay(parseISO(date), parseISO(today))
  );
  
  // Generate last 7 days for the calendar view
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = startOfDay(date).toISOString();
    const isCompleted = habit.completions.some(d => 
      isSameDay(parseISO(d), date)
    );
    return {
      date: dateStr,
      day: format(date, 'd'),
      isToday: i === 0,
      isCompleted
    };
  }).reverse();

  const getCategoryColor = () => {
    switch (habit.category) {
      case 'health': return 'var(--success-color)';
      case 'fitness': return 'var(--warning-color)';
      case 'productivity': return 'var(--accent-primary)';
      case 'mindfulness': return 'var(--accent-secondary)';
      case 'learning': return '#9333ea'; // Purple
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <motion.div 
      className="card"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="habit-card-header">
        <div>
          <h3 className="habit-card-title">{habit.name}</h3>
          <div className="habit-card-category" style={{ color: getCategoryColor() }}>
            {habit.category}
          </div>
        </div>
        <div className="habit-card-actions">
          <motion.button 
            className="btn-icon"
            onClick={() => setShowCalendar(!showCalendar)}
            whileTap={{ scale: 0.95 }}
            aria-label="Show calendar"
          >
            <FaCalendarAlt size={16} />
          </motion.button>
          <motion.button 
            className="btn-icon"
            onClick={() => deleteHabit(habit.id)}
            whileTap={{ scale: 0.95 }}
            aria-label="Delete habit"
          >
            <FaTrash size={16} />
          </motion.button>
        </div>
      </div>
      
      {habit.description && (
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {habit.description}
        </p>
      )}
      
      <div className="habit-card-progress">
        <div className="progress-ring-container">
          <CircularProgressbar
            value={completionRate}
            strokeWidth={10}
            styles={buildStyles({
              strokeLinecap: 'round',
              pathColor: getCategoryColor(),
              trailColor: 'var(--border-color)',
            })}
          />
          <div className="progress-ring-text">
            <div className="progress-ring-value">{completionRate}%</div>
            <div className="progress-ring-label">Complete</div>
          </div>
        </div>
      </div>
      
      {showCalendar && (
        <div className="calendar-grid">
          {last7Days.map((day, index) => (
            <motion.div
              key={index}
              className={`calendar-day ${day.isToday ? 'today' : ''} ${day.isCompleted ? 'completed' : ''}`}
              onClick={() => toggleHabitCompletion(habit.id, day.date)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {day.day}
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="habit-card-footer">
        <div className="habit-card-streak">
          <FaFire size={16} style={{ color: 'var(--warning-color)' }} />
          <span>{streak} day streak</span>
        </div>
        
        <motion.button
          className={`btn ${isCompletedToday ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => toggleHabitCompletion(habit.id, today)}
          whileTap={{ scale: 0.95 }}
        >
          <FaCheck size={14} />
          {isCompletedToday ? 'Completed' : 'Complete'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HabitCard;
