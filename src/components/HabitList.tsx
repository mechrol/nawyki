import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';
import HabitCard from './HabitCard';
import { FaClipboardList } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { HabitCategory } from '../types';

const HabitList = () => {
  const { habits } = useHabit();
  const [filter, setFilter] = useState<HabitCategory | 'all'>('all');

  const filteredHabits = filter === 'all' 
    ? habits 
    : habits.filter(habit => habit.category === filter);

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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <section className="habit-list-section">
      <div className="section-header">
        <h2 className="section-title">Your Habits</h2>
        
        <div className="tab-group">
          <button 
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`tab ${filter === 'health' ? 'active' : ''}`}
            onClick={() => setFilter('health')}
          >
            Health
          </button>
          <button 
            className={`tab ${filter === 'fitness' ? 'active' : ''}`}
            onClick={() => setFilter('fitness')}
          >
            Fitness
          </button>
          <button 
            className={`tab ${filter === 'productivity' ? 'active' : ''}`}
            onClick={() => setFilter('productivity')}
          >
            Productivity
          </button>
        </div>
      </div>
      
      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaClipboardList />
          </div>
          <h3 className="empty-state-title">No habits yet</h3>
          <p className="empty-state-description">
            Start by adding a new habit above to begin tracking your progress.
          </p>
        </div>
      ) : filteredHabits.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No habits in this category</h3>
          <p className="empty-state-description">
            Try selecting a different category or add a new habit.
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredHabits.map(habit => (
              <motion.div 
                key={habit.id}
                variants={itemVariants}
                exit="exit"
                layout
              >
                <HabitCard habit={habit} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};

export default HabitList;
