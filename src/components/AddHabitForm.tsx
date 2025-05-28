import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';
import { HabitCategory } from '../types';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AddHabitForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [frequency, setFrequency] = useState(3);
  
  const { addHabit } = useHabit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    addHabit({
      name,
      description,
      category,
      frequency
    });
    
    // Reset form
    setName('');
    setDescription('');
    setCategory('health');
    setFrequency(3);
    setIsFormOpen(false);
  };

  const formVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.3,
        when: "afterChildren",
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className="card">
      <div className="section-header">
        <h2 className="section-title">Add New Habit</h2>
        <motion.button
          className="btn-icon"
          onClick={() => setIsFormOpen(!isFormOpen)}
          whileTap={{ scale: 0.95 }}
          aria-label={isFormOpen ? "Close form" : "Open form"}
        >
          {isFormOpen ? <FaTimes size={18} /> : <FaPlus size={18} />}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="habit-name">Habit Name</label>
              <input
                id="habit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Morning Meditation"
                required
              />
            </motion.div>
            
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="habit-description">Description (Optional)</label>
              <textarea
                id="habit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why is this habit important to you?"
                rows={3}
              />
            </motion.div>
            
            <motion.div className="form-row" variants={itemVariants}>
              <div className="form-group">
                <label htmlFor="habit-category">Category</label>
                <select
                  id="habit-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HabitCategory)}
                >
                  <option value="health">Health</option>
                  <option value="fitness">Fitness</option>
                  <option value="productivity">Productivity</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="learning">Learning</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="habit-frequency">Weekly Goal (days)</label>
                <select
                  id="habit-frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'day' : 'days'}</option>
                  ))}
                </select>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <button type="submit" className="btn btn-primary">
                <FaPlus size={14} />
                Add Habit
              </button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddHabitForm;
