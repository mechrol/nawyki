import { useHabit } from '../context/HabitContext';
import { FaFire, FaCheckCircle, FaCalendarCheck, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { habits, getHabitStreak, getHabitCompletionRate } = useHabit();

  // Calculate stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => 
    habit.completions.some(date => new Date(date).toDateString() === new Date().toDateString())
  ).length;
  
  const completionRate = totalHabits > 0 
    ? Math.round(habits.reduce((sum, habit) => sum + getHabitCompletionRate(habit), 0) / totalHabits) 
    : 0;
  
  const longestStreak = habits.reduce((max, habit) => {
    const streak = getHabitStreak(habit);
    return streak > max ? streak : max;
  }, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Dashboard</h2>
      </div>
      
      <motion.div 
        className="dashboard"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="stat-card" variants={itemVariants}>
          <FaCheckCircle size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
          <div className="stat-card-value">{totalHabits}</div>
          <div className="stat-card-label">Total Habits</div>
        </motion.div>
        
        <motion.div className="stat-card" variants={itemVariants}>
          <FaCalendarCheck size={24} style={{ color: 'var(--success-color)', marginBottom: '0.5rem' }} />
          <div className="stat-card-value">{completedToday}</div>
          <div className="stat-card-label">Completed Today</div>
        </motion.div>
        
        <motion.div className="stat-card" variants={itemVariants}>
          <FaFire size={24} style={{ color: 'var(--warning-color)', marginBottom: '0.5rem' }} />
          <div className="stat-card-value">{longestStreak}</div>
          <div className="stat-card-label">Longest Streak</div>
        </motion.div>
        
        <motion.div className="stat-card" variants={itemVariants}>
          <FaTrophy size={24} style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }} />
          <div className="stat-card-value">{completionRate}%</div>
          <div className="stat-card-label">Completion Rate</div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Dashboard;
