import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, File, Check, X, AlertCircle } from 'lucide-react'
import { parseDocxFile, parsePdfFile } from '../utils/fileParser'

const FileImportPanel = ({ onImportHabits }) => {
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  const [selectedHabits, setSelectedHabits] = useState({})
  const [error, setError] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file) => {
    setError(null)
    setIsProcessing(true)
    setParsedData(null)
    setSelectedHabits({})

    try {
      let content = ''
      
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        content = await parseDocxFile(file)
      } else if (file.type === 'application/pdf') {
        content = await parsePdfFile(file)
      } else {
        throw new Error('Unsupported file type. Please upload a .docx or .pdf file.')
      }

      const parsed = parseHabitContent(content)
      setParsedData(parsed)
      
      // Initialize all habits as selected
      const initialSelection = {}
      parsed.categories.forEach(category => {
        category.habits.forEach(habit => {
          initialSelection[habit.id] = true
        })
      })
      setSelectedHabits(initialSelection)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const parseHabitContent = (content) => {
    const categories = []
    const lines = content.split('\n').filter(line => line.trim())
    
    let currentCategory = null
    let currentTopic = null
    let habitCounter = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Skip empty lines and common headers/footers
      if (!line || line.toLowerCase().includes('conclusion') || line.length < 3) continue
      
      // Check if this looks like a category (usually standalone, capitalized)
      if (line.length < 50 && !line.match(/^\d+\./) && line.match(/^[A-Z]/)) {
        // If we have a current category, save it
        if (currentCategory && currentCategory.habits.length > 0) {
          categories.push(currentCategory)
        }
        
        currentCategory = {
          name: line,
          topic: '',
          habits: []
        }
        continue
      }
      
      // Check if this looks like a topic (longer descriptive text)
      if (currentCategory && !currentCategory.topic && line.length > 20 && !line.match(/^\d+\./)) {
        currentCategory.topic = line
        continue
      }
      
      // Check if this is a numbered habit
      const habitMatch = line.match(/^(\d+)\.\s*(.+)/)
      if (habitMatch && currentCategory) {
        const [, number, habitText] = habitMatch
        const habit = parseHabitText(habitText, habitCounter++)
        if (habit) {
          currentCategory.habits.push(habit)
        }
      }
    }
    
    // Add the last category
    if (currentCategory && currentCategory.habits.length > 0) {
      categories.push(currentCategory)
    }
    
    // If no categories were found, create a default one
    if (categories.length === 0) {
      const defaultCategory = {
        name: 'Imported Habits',
        topic: 'Habits from imported document',
        habits: []
      }
      
      // Try to extract habits from the entire content
      const habitMatches = content.match(/\d+\.\s*[^.]+/g)
      if (habitMatches) {
        habitMatches.forEach((match, index) => {
          const habitText = match.replace(/^\d+\.\s*/, '')
          const habit = parseHabitText(habitText, index)
          if (habit) {
            defaultCategory.habits.push(habit)
          }
        })
      }
      
      if (defaultCategory.habits.length > 0) {
        categories.push(defaultCategory)
      }
    }
    
    return { categories }
  }

  const parseHabitText = (text, index) => {
    // Split by colon to separate name and description
    const parts = text.split(':')
    const name = parts[0].trim()
    const description = parts.length > 1 ? parts.slice(1).join(':').trim() : ''
    
    if (name.length < 3) return null
    
    // Determine difficulty based on keywords
    let difficulty = 'medium'
    const lowerText = text.toLowerCase()
    if (lowerText.includes('easy') || lowerText.includes('simple') || lowerText.includes('start')) {
      difficulty = 'easy'
    } else if (lowerText.includes('hard') || lowerText.includes('challenging') || lowerText.includes('intensive')) {
      difficulty = 'hard'
    }
    
    // Determine category based on keywords
    let category = 'lifestyle'
    if (lowerText.includes('exercise') || lowerText.includes('workout') || lowerText.includes('physical')) {
      category = 'health'
    } else if (lowerText.includes('read') || lowerText.includes('learn') || lowerText.includes('study')) {
      category = 'learning'
    } else if (lowerText.includes('meditat') || lowerText.includes('mindful') || lowerText.includes('relax')) {
      category = 'mindfulness'
    } else if (lowerText.includes('work') || lowerText.includes('productive') || lowerText.includes('goal')) {
      category = 'productivity'
    }
    
    return {
      id: `imported-${index}`,
      name: name.length > 50 ? name.substring(0, 50) + '...' : name,
      description: description || name,
      category,
      difficulty,
      frequency: 'daily'
    }
  }

  const toggleHabitSelection = (habitId) => {
    setSelectedHabits(prev => ({
      ...prev,
      [habitId]: !prev[habitId]
    }))
  }

  const selectAllInCategory = (categoryIndex, select) => {
    const category = parsedData.categories[categoryIndex]
    const updates = {}
    category.habits.forEach(habit => {
      updates[habit.id] = select
    })
    setSelectedHabits(prev => ({ ...prev, ...updates }))
  }

  const importSelectedHabits = () => {
    const habitsToImport = []
    parsedData.categories.forEach(category => {
      category.habits.forEach(habit => {
        if (selectedHabits[habit.id]) {
          habitsToImport.push(habit)
        }
      })
    })
    
    if (habitsToImport.length > 0) {
      onImportHabits(habitsToImport)
      setParsedData(null)
      setSelectedHabits({})
    }
  }

  const selectedCount = Object.values(selectedHabits).filter(Boolean).length

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-4">Import Habits from File</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Upload a .docx or .pdf file containing habit lists to import them into your tracker
        </p>
      </div>

      {!parsedData && (
        <motion.div
          className={`glass-card p-8 border-2 border-dashed transition-all duration-300 ${
            dragActive 
              ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Drop your file here
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              or click to browse for .docx or .pdf files
            </p>
            
            <input
              type="file"
              accept=".docx,.pdf"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <FileText className="w-5 h-5" />
              <span>Choose File</span>
            </label>
          </div>
        </motion.div>
      )}

      {isProcessing && (
        <motion.div
          className="glass-card p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Processing File...
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Extracting habits from your document
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="glass-card p-6 border-l-4 border-red-500"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <div>
              <h4 className="font-semibold text-red-700 dark:text-red-400">Error Processing File</h4>
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {parsedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between glass-card p-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Select Habits to Import
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedCount} of {parsedData.categories.reduce((total, cat) => total + cat.habits.length, 0)} habits selected
                </p>
              </div>
              <button
                onClick={importSelectedHabits}
                disabled={selectedCount === 0}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import {selectedCount} Habits
              </button>
            </div>

            {parsedData.categories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {category.name}
                    </h4>
                    {category.topic && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {category.topic}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => selectAllInCategory(categoryIndex, true)}
                      className="text-sm px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => selectAllInCategory(categoryIndex, false)}
                      className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.habits.map((habit) => (
                    <motion.div
                      key={habit.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        selectedHabits[habit.id]
                          ? 'border-green-400 bg-green-50/50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => toggleHabitSelection(habit.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800 dark:text-white mb-2">
                            {habit.name}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {habit.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              habit.difficulty === 'easy' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : habit.difficulty === 'hard'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {habit.difficulty}
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {habit.category}
                            </span>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedHabits[habit.id]
                            ? 'border-green-400 bg-green-400'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedHabits[habit.id] && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FileImportPanel
